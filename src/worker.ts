import { createGameCompiledProgram, getTypeInjectsAndTypedStats } from 'crosscode-typedef-inserter/src/type-injects'
import type { CommitInfo, DataPoint } from './generate-data-points'
import { $ } from 'bun'
import { getModulesInfo } from 'crosscode-typedef-inserter/src/modules-info'

const { index, repoPath, gameCompiledPath, commits } = JSON.parse(Bun.argv[2])
const dataPoints = await generateDataPoints(index, repoPath, gameCompiledPath, commits)

console.log(JSON.stringify(dataPoints))

async function generateDataPoints(index: number, repoPath: string, gameCompiledPath: string, commits: CommitInfo[]) {
    const dataPoints: DataPoint[] = []
    await $`rm -rf ./temp/repo${index}`
    await $`cp -rf "${repoPath}" ./temp/repo${index}`

    const typedefRepoPath = `/home/krypek/home/Programming/repos/crosscode-typedef-percentage/temp/repo${index}`

    const gameCompiledInfo = await createGameCompiledProgram(gameCompiledPath)

    console.warn('worker:', await $`pwd`.text())

    try {
        for (let i = 0; i < commits.length; i++) {
            const { sha, date, author } = commits[i]

            $.cwd(typedefRepoPath)
            await $`git reset --hard ${sha}`.quiet()

            const backup = console.log
            console.log = () => {}
            try {
                const typedefModulesPath = `${typedefRepoPath}/modules`
                const { typedefModuleRecord, classPathToModule } = await getModulesInfo(typedefModulesPath)

                const { typedStats: typedefData } = await getTypeInjectsAndTypedStats(classPathToModule, typedefModuleRecord, typedefModulesPath, gameCompiledInfo, false)

                dataPoints.push({
                    author,
                    sha,
                    typedefData,
                    date,
                })
                console.warn(`worker ${index}: ${sha} done, ${typedefData.fields.typed} ${i}/${commits.length}`)
            } catch (e) {
                console.error(`worker ${index}: ${sha} failed to generate`, e)
            } finally {
                console.log = backup
            }
        }
    } catch (e) {
        console.error(index)
        throw e
    }
    return dataPoints
}
