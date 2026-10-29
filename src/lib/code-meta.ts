// Blocks longer than this many lines start collapsed, showing PREVIEW_LINES lines.
export const COLLAPSE_AFTER = 20
export const PREVIEW_LINES = 12

export type CodeMeta = {
    title?: string
    highlight: Set<number> // 1-based line numbers
    lineNumbers: boolean
    diff: boolean
    terminal: boolean
    expanded: boolean // never collapse
}

// Reads the text after the language on a fence line: title="a.js" {2,4-6} ln diff terminal expanded.
// Use on the server for every code block.
export function parseMeta(meta: string): CodeMeta {
    const result: CodeMeta = { highlight: new Set(), lineNumbers: false, diff: false, terminal: false, expanded: false }

    let rest = meta.replace(/\b(?:title|file)=(?:"([^"]*)"|'([^']*)'|(\S+))/, (_match, a?: string, b?: string, c?: string) => {
        result.title = a ?? b ?? c
        return ' '
    })

    rest = rest.replace(/\{([\d,\s-]+)\}/, (_match, list: string) => {
        for (const part of list.split(',')) {
            const [from, to] = part.split('-').map((value) => parseInt(value.trim(), 10))
            if (Number.isNaN(from)) continue
            const end = to !== undefined && !Number.isNaN(to) ? to : from
            for (let line = from; line <= end && line - from < 1000; line++) result.highlight.add(line)
        }
        return ' '
    })

    for (const flag of rest.split(/\s+/)) {
        const name = flag.toLowerCase()
        if (name === 'ln' || name === 'showlinenumbers') result.lineNumbers = true
        else if (name === 'diff') result.diff = true
        else if (name === 'terminal') result.terminal = true
        else if (name === 'expanded') result.expanded = true
    }
    return result
}