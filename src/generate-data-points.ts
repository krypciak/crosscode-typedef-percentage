import { $ } from 'bun'
import type { getTypeInjectsAndTypedStats } from 'crosscode-typedef-inserter/src/type-injects'

const repoPath = '/home/krypek/Programming/repos/ultimate-crosscode-typedefs'
const gameCompiledPath = '/home/krypek/Programming/repos/crosscode-typedef-inserter/game-compiled/game.compiled.lebab.js'

export type TypedStats = Awaited<ReturnType<typeof getTypeInjectsAndTypedStats>>['typedStats']

export interface CommitInfo {
    sha: string
    date: number
    author: string
    title: string
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
    await $`rm -rf ./temp/repo`
    await $`cp -rf "${repoPath}" ./temp/repo`

    $.cwd('./temp/repo')
    const commitData: string = await $`git log --pretty=format:"%H@@%ad@@%an@@%s" --date=unix --no-merges`.text()
    $.cwd('.')
    console.log('cwd:', await $`pwd`.text())

    const allCommits: CommitInfo[] = commitData.split('\n').map(line => {
        const [sha, dateStr, author, title] = line.split('@@')
        const date = Number(dateStr)
        return { sha, date, author, title }
    })
    const commitChunks = chunkArray(allCommits, threadCount)

    const promises: Promise<string>[] = []
    for (let index = 0; index < threadCount; index++) {
        const data = {
            index,
            repoPath,
            gameCompiledPath,
            commits: commitChunks[index],
        }
        const proc = Bun.spawn(['bun', 'run', 'src/worker.ts', JSON.stringify(data)])

        promises.push(new Response(proc.stdout).text())
    }

    const chunksRaw = await Promise.all(promises)
    const chunks = chunksRaw.map(str => JSON.parse(str))
    const allChunks = chunks.flatMap(a => a)
    console.log('allChunks:')
    console.log(allChunks.length)

    await Bun.write('src/dataPoints.json', JSON.stringify(allChunks))
}

await startThreads(10)
