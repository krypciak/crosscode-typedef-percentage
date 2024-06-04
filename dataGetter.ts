import * as fs from 'fs'

export function run(print: boolean, repoPath: string, genModulesStr: string) {
    const modulesPath = `${repoPath}/modules`
    const modulesList = fs.readdirSync(modulesPath)

    interface Class {
        path: string
        name: string
        fields: Set<string>
        functions: Set<string>

        startLine?: number
        endLine?: number
    }
    interface Namespace {
        path: string
        name: string
        classes: Record<string, Class>
        fields: Set<string>
        functions: Set<string>
        namespaces: Record<string, Namespace>

        startLine?: number
        endLine?: number
        indentLevel?: number
    }

    let sp = genModulesStr.split('\n')
    function findLine(toFind: string, startLine: number = 0): number {
        for (let i = startLine; i < sp.length; i++) {
            const line = sp[i]
            if (line == toFind) {
                return i
            }
        }
        return -1
    }

    function createIndent(level: number, size = 4) {
        let str = ''
        for (let i = 0; i < level; i++) {
            for (let x = 0; x < size; x++) {
                str += ' '
            }
        }
        return str
    }

    const gen_root: Namespace = {
        startLine: 0,
        endLine: sp.length,
        name: '',
        path: '',
        indentLevel: 0,
        classes: {},
        fields: new Set(),
        functions: new Set(),
        namespaces: {},
    }

    function gen_begin(path: string) {
        const startLine = findLine(`declare namespace ${path} {`)
        const endLine = findLine(`}`, startLine)
        const ns: Namespace = { startLine, endLine, name: path, path, indentLevel: 0, classes: {}, fields: new Set(), functions: new Set(), namespaces: {} }
        gen_gen(ns)
        gen_root.namespaces[path] = ns
    }

    function gen_gen(ns: Namespace) {
        for (let li = ns.startLine! + 1; li < ns.endLine!; li++) {
            let line = sp[li].trim()
            if (line.startsWith('export class')) {
                const className = line.matchAll(/export class (\w+)/g).next().value[1]
                const endLine = findLine(`${createIndent(ns.indentLevel! + 1)}}`, li)

                const fields: Set<string> = new Set()
                const functions: Set<string> = new Set()
                li++
                for (; li < endLine; li++) {
                    line = sp[li].trim()
                    if (line.length == 0) continue
                    line = line.slice('public '.length, line.length - 1)
                    if (line.startsWith('constructor') || line.startsWith('init') || line.startsWith('static ')) continue
                    let name = line.slice(0, line.indexOf(':'))
                    if (name.match(/\(/g)) {
                        /* is a function */
                        name = name.slice(0, line.indexOf('('))
                        functions.add(name)
                    } else {
                        fields.add(name)
                    }
                }

                const classs: Class = {
                    startLine: li,
                    endLine: endLine,
                    name: className,
                    path: `${ns.path}.${className}`,
                    fields,
                    functions,
                }
                ns.classes[classs.name] = classs
            } else if (line.startsWith('export namespace')) {
                const namespaceName = line.matchAll(/export namespace (\w+)/g).next().value[1]
                const endLine = findLine(`${createIndent(ns.indentLevel! + 1)}}`, li)
                const newNs: Namespace = {
                    startLine: li,
                    endLine,
                    name: namespaceName,
                    path: `${ns.path}.${namespaceName}`,
                    indentLevel: ns.indentLevel! + 1,
                    classes: {},
                    fields: new Set(),
                    functions: new Set(),
                    namespaces: {},
                }
                gen_gen(newNs)
                ns.namespaces[newNs.name] = newNs
            }
        }
    }

    gen_begin('ig')
    gen_begin('sc')

    let li: number = 0
    const mod_root: Namespace = {
        startLine: 0,
        endLine: sp.length,
        name: '',
        path: '',
        indentLevel: 0,
        classes: {},
        fields: new Set(),
        functions: new Set(),
        namespaces: {},
    }

    function mod_begin(filename: string) {
        const content = fs.readFileSync(`${modulesPath}/${filename}`).toString()
        sp = content.split('\n').filter(str => str.trim() && !str.trimStart().startsWith('//'))
        if (sp.length == 0) return

        mod_gen(mod_root, 0, sp.length)
    }

    function mod_gen(ns: Namespace, startLine: number, endLine: number) {
        for (li = startLine + 1; li < endLine; li++) {
            let line = sp[li].trim()
            if (line == 'export {};' || line == 'declare global {') continue
            if (line.startsWith('interface') && !line.match(/:/)) {
                const className: string = line.matchAll(/interface (\w+)/g).next().value[1]
                const endLine = line.endsWith('}') ? li : findLine(`${createIndent(ns.indentLevel! + 1, 2)}}`, li)
                if (className.toLowerCase().match('constructor')) continue

                let classs = ns.classes[className]
                if (!classs) {
                    classs = {
                        name: className,
                        path: `${ns.path}.${className}`,
                        fields: new Set(),
                        functions: new Set(),
                    }
                }
                const fields: Set<string> = classs.fields
                const functions: Set<string> = classs.functions
                li++
                for (; li < endLine; li++) {
                    line = sp[li].trimEnd()
                    line = line.slice((ns.indentLevel! + 2) * 2)
                    if (line.length == 0 || line.startsWith(' ') || line.startsWith('\t') || line.startsWith('/') || line.startsWith('new ')) continue
                    line = line.slice(0, line.indexOf(';'))
                    let name = line.slice(0, line.indexOf(':'))
                    if (name.match(/\(/g)) {
                        /* is a function */
                        name = name.slice(0, line.indexOf('('))
                        if (name.match(/</)) name = name.slice(0, line.indexOf('<'))
                        if (name.endsWith('?')) name = name.slice(0, name.length - 1)
                        functions.add(name)
                    } else {
                        if (name.endsWith('?')) name = name.slice(0, name.length - 1)
                        fields.add(name)
                    }
                }
                ns.classes[classs.name] = classs
            } else if (line.startsWith('namespace')) {
                let nsn = ns
                let namespaceNames = line.split(' ')[1].split('.')
                let namespaceName!: string
                for (let i = 0; i < namespaceNames.length; i++) {
                    namespaceName = namespaceNames[i]
                    let newNs: Namespace = nsn.namespaces[namespaceName]
                    if (!newNs) {
                        newNs = {
                            name: namespaceName,
                            path: `${nsn.path ? `${nsn.path}.` : ''}${namespaceName}`,
                            indentLevel: nsn.indentLevel! + 1,
                            classes: {},
                            fields: new Set(),
                            functions: new Set(),
                            namespaces: {},
                        }
                    }
                    nsn.namespaces[namespaceName] = newNs
                    nsn = newNs
                }

                // const namespaceName = line.matchAll(/namespace (\w+)/g).next().value[1]
                const endLine = findLine(`${createIndent(ns.indentLevel! + 1, 2)}}`, li)
                mod_gen(nsn, li, endLine)
            }
        }
    }

    for (const filename of modulesList.filter(m => m != '__all__.d.ts')) {
        // console.log(filename, '------------------------------------------------')
        mod_begin(filename)
    }

    function rec(ns: Namespace, arr: string[], add: (ns: Namespace, arr: string[]) => void) {
        // for (const f of ns.fields) {
        //     console.log('namespace field:', f)
        // }
        add(ns, arr)
        for (const ns1 in ns.namespaces) {
            rec(ns.namespaces[ns1], arr, add)
        }
        return arr
    }
    function getClasses(ns: Namespace) {
        return rec(ns, [], (ns, arr) => arr.push(...Object.values(ns.classes).map(c => c.path)))
    }
    function getFields(ns: Namespace) {
        return rec(ns, [], (ns, arr) => arr.push(...Object.values(ns.classes).flatMap(c => [...c.fields].map(f => `${c.path}#${f}`))))
    }
    function getFunctions(ns: Namespace) {
        return rec(ns, [], (ns, arr) => arr.push(...Object.values(ns.classes).flatMap(c => [...c.functions].map(f => `${c.path}#${f}`))))
    }

    function intersect<T extends any[]>(prim: T, seco: T) {
        return prim.filter(value => seco.includes(value))
    }
    // function antiIntersect<T extends any[]>(prim: T, seco: T) {
    //     return prim.filter(value => !seco.includes(value))
    // }

    function compare(primNs: Namespace, secoNs: Namespace) {
        const prim = {
            classes: getClasses(primNs),
            fields: getFields(primNs),
            functions: getFunctions(primNs),
        }
        const seco = {
            classes: getClasses(secoNs),
            fields: getFields(secoNs),
            functions: getFunctions(secoNs),
        }
        const common = {
            classes: intersect(prim.classes, seco.classes),
            fields: intersect(prim.fields, seco.fields),
            functions: intersect(prim.functions, seco.functions),
        }
        const percentages = {
            classes: (common.classes.length / prim.classes.length) * 100,
            fields: (common.fields.length / prim.fields.length) * 100,
            functions: (common.functions.length / prim.functions.length) * 100,
        }

        if (print) {
            console.log(`classes: total: ${prim.classes.length}, typedefs: ${common.classes.length}, ${percentages.classes.toFixed(2)}%`)
            console.log(`fields: total: ${prim.fields.length}, typedefs: ${common.fields.length}, ${percentages.fields.toFixed(2)}%`)
            console.log(`functions: total: ${prim.functions.length}, typedefs: ${common.functions.length}, ${percentages.functions.toFixed(2)}%`)
            console.log(`total (avg % of classes + fields + functions): ${((percentages.classes + percentages.fields + percentages.functions) / 3).toFixed(2)}%`)
        }

        return { prim, seco, common, percentages }
    }
    return compare(gen_root, mod_root)
}
