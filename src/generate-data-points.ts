import { $ } from 'bun'
import type { getTypeInjectsAndTypedStats } from 'crosscode-typedef-inserter/src/type-injects'

const repoPath = '/home/krypek/Programming/repos/ultimate-crosscode-typedefs'
const gameCompiledPath = '/home/krypek/Programming/repos/crosscode-typedef-inserter/game-compiled/game.compiled.lebab.js'

export type TypedStats = Awaited<ReturnType<typeof getTypeInjectsAndTypedStats>>['typedStats']

export interface CommitInfo {
    sha: string
    date: number
    author: string
}

export interface DataPoint extends CommitInfo {
    typedefData: TypedStats
}

function chunkArray<T>(array: T[], numberOfChunks: number): T[][] {
    const chunkSize = Math.ceil(array.length / numberOfChunks)

    return Array.from(
        {
            length: numberOfChunks,
        },
        (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize)
    )
}

async function startThreads(threadCount: number) {
    await $`mkdir -p ./temp`
    await $`cp -rf "${repoPath}" ./temp/repo`

    $.cwd('./temp/repo')
    const commitData: string = await $`git log --pretty=format:"%H %cd %an" --date=unix --no-merges`.text()

    const allCommits: CommitInfo[] = commitData.split('\n').map(line => {
        const split = line.split(' ')
        const sha = split[0]
        split.shift()
        const date = Number(split[0])
        split.shift()
        const author = split.join(' ')
        return { sha, date, author }
    })
    const commitChunks = chunkArray(allCommits, threadCount)

    const promises: Promise<DataPoint[]>[] = []
    for (let index = 0; index < threadCount; index++) {
        const worker = new Worker('src/worker.ts')

        promises.push(
            new Promise<DataPoint[]>(resolve => {
                worker.onmessage = event => {
                    resolve(event.data)
                }
            })
        )

        worker.postMessage({
            index,
            repoPath,
            gameCompiledPath,
            commits: commitChunks[index],
        })
    }

    // $.cwd('.')
    // await $`rm -rf ./temp`

    const allChunks = (await Promise.all(promises)).flatMap(a => a)
    console.log('allChunks:')
    console.log(allChunks)

    // await Bun.write('dataPoints.json', JSON.stringify(dataPoints))
}

await startThreads(1)
