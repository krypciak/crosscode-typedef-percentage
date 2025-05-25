import { createGameCompiledProgram, getTypeInjectsAndTypedStats } from 'crosscode-typedef-inserter/src/type-injects'
import type { CommitInfo, DataPoint } from './generate-data-points'
import { $ } from 'bun'
import { getModulesInfo } from 'crosscode-typedef-inserter/src/modules-info'

declare var self: Worker

self.onmessage = async (event: MessageEvent) => {
    const { index, repoPath, gameCompiledPath, commits } = event.data

    await generateDataPoints(index, repoPath, gameCompiledPath, commits)

    postMessage('world')
    self.terminate()
}

async function generateDataPoints(index: number, repoPath: string, gameCompiledPath: string, commits: CommitInfo[]) {
    const dataPoints: DataPoint[] = []
    await $`cp -rf "${repoPath}" ./temp/repo${index}`

    $.cwd('./temp/repo')

    const gameCompiledInfo = await createGameCompiledProgram(gameCompiledPath)

    for (const { sha, date, author } of commits) {
        await $`git reset --hard ${sha}`.quiet()

        const typedefRepoPath = './temp/repo'
        const typedefModulesPath = `${typedefRepoPath}/modules`
        const { typedefModuleRecord, classPathToModule } = await getModulesInfo(typedefModulesPath)

        const { typedStats: typedefData } = await getTypeInjectsAndTypedStats(classPathToModule, typedefModuleRecord, typedefModulesPath, gameCompiledInfo, false)

        dataPoints.push({
            author,
            sha,
            typedefData,
            date,
        })
        console.log(`${sha} done, ${typedefData.fields.typed}`)
        break
        // if (typedefData.fields == 0) break
    }
    return dataPoints
}
