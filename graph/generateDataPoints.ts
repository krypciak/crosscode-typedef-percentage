import { $ } from 'bun'
import { run } from '../dataGetter.js'

const REPO_PATH = '/home/krypek/Programming/repos/ultimate-crosscode-typedefs'
const genModules = `../output.d.ts`
const genModulesStr = await $`cat ${genModules}`.text()

type DataPoint = {
    date: number
    author: string
    sha: string
    typedefData: ReturnType<typeof run>['percentages']
}

async function generateDataPoints() {
    const dataPoints: DataPoint[] = []
    await $`mkdir -p ./temp`
    await $`cp -rf "${REPO_PATH}" ./temp/repo`

    $.cwd('./temp/repo')
    const commitData: string = await $`git log --pretty=format:"%H %cd %an" --date=unix --no-merges`.text()

    const commits: {
        sha: string
        date: number
        author: string
    }[] = commitData.split('\n').map(line => {
        const split = line.split(' ')
        const sha = split[0]
        split.shift()
        const date = Number(split[0])
        split.shift()
        const author = split.join(' ')
        return { sha, date, author }
    })

    for (const { sha, date, author } of commits) {
        await $`git reset --hard ${sha}`.quiet()

        const typedefData = run(false, './temp/repo', genModulesStr)['percentages']

        dataPoints.push({
            author,
            sha,
            typedefData,
            date,
        })
        console.log(`${sha} done, ${typedefData.fields}`)
        if (typedefData.fields == 0) break
    }
    $.cwd('../..')
    await $`rm -rf ./temp`

    await Bun.write('dataPoints.json', JSON.stringify(dataPoints))
    return dataPoints
}

let dataPoints: Record<number /* date */, DataPoint> = {}
// try {
//     const jsonData = await $`cat dataPoints.json`.text()
//     dataPoints = JSON.parse(jsonData)
// } catch (e) {
dataPoints = await generateDataPoints()
// }
