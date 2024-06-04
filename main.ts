import { run } from './dataGetter.js'
import * as fs from 'fs'

const genModules = `output.d.ts`
const genModulesStr = fs.readFileSync(genModules).toString()

run(true, `/home/krypek/Programming/crosscode/ultimate-crosscode-typedefs`, genModulesStr)
