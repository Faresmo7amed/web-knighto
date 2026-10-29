import type { BundledLanguage } from 'shiki'
import type { CodeMeta } from './code-meta'
import { getHighlighter } from './shiki'

export type Seg = { text: string; color?: string; italic?: boolean; bold?: boolean }
export type LineKind = 'code' | 'add' | 'del' | 'out' | 'error' | 'warn'
export type CodeLine = { kind: LineKind; segs: Seg[]; marker?: string; prompt?: string }
export type CodeResult = { lines: CodeLine[]; copyText: string }

type Parsed = { kind: LineKind; text: string; marker?: string; prompt?: string }

const SHELL = new Set(['bash', 'sh', 'shell', 'zsh', 'console', 'terminal', 'git-bash', 'gitbash', 'powershell', 'ps1', 'pwsh'])
const PROMPT = /^(PS [^>\n]*> |PS> |\$ |> |% )/

// Names people write after ``` mapped to the names Shiki knows
const aliases: Record<string, string> = {
    js: 'javascript', mjs: 'javascript', cjs: 'javascript', ts: 'typescript', py: 'python', rs: 'rust',
    cs: 'csharp', 'c#': 'csharp', 'c++': 'cpp', yml: 'yaml', md: 'markdown', docker: 'dockerfile',
    sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash', terminal: 'bash', 'git-bash': 'bash', gitbash: 'bash',
    ps1: 'powershell', pwsh: 'powershell', plaintext: 'text', txt: 'text', plain: 'text', '': 'text',
}

// Reads one bit of Shiki's fontStyle number (-1 means "not set").
function hasStyle(fontStyle: number | undefined, bit: number): boolean {
    return fontStyle !== undefined && fontStyle > 0 && (fontStyle & bit) !== 0
}

// Splits the code into lines and decides what each line is: code, added, removed, command, or output.
// Prompts and diff markers are cut off the text here and drawn separately (so they cannot be selected or copied).
function parseLines(code: string, lang: string, meta: CodeMeta): Parsed[] {
    const raw = code.split('\n')
    const markers = meta.diff && lang !== 'diff'
    const terminal = meta.terminal || SHELL.has(lang)
    const hasPrompt = terminal && raw.some((line) => PROMPT.test(line))

    return raw.map((line): Parsed => {
        if (lang === 'diff') {
            if (/^\+(?!\+\+)/.test(line)) return { kind: 'add', text: line }
            if (/^-(?!--)/.test(line)) return { kind: 'del', text: line }
            return { kind: 'code', text: line }
        }
        if (markers) {
            if (line.startsWith('+') || line.startsWith('-')) {
                return { kind: line[0] === '+' ? 'add' : 'del', marker: line[0], text: line.slice(1).replace(/^ /, '') }
            }
            return { kind: 'code', marker: ' ', text: line }
        }
        if (hasPrompt) {
            const match = PROMPT.exec(line)
            if (match) return { kind: 'code', prompt: match[0], text: line.slice(match[0].length) }
            if (/^\s*(error|err!|fatal|✖|×)/i.test(line)) return { kind: 'error', text: line }
            if (/^\s*warn/i.test(line)) return { kind: 'warn', text: line }
            return { kind: 'out', text: line }
        }
        return { kind: 'code', text: line }
    })
}

type TokenLine = { content: string; color?: string; fontStyle?: number }[]

// Highlights code with Shiki. Cached, so Next.js treats it as stable output (Shiki reads the clock internally).
// Same code + same language gives the same tokens, so caching is safe.
async function highlightTokens(text: string, lang: string): Promise<TokenLine[]> {
    'use cache'
    const highlighter = await getHighlighter()
    const { tokens } = highlighter.codeToTokens(text, { lang: lang as BundledLanguage, theme: 'site' })
    return tokens.map((line) => line.map((token) => ({ content: token.content, color: token.color, fontStyle: token.fontStyle })))
}

// Turns a code string into highlighted lines plus the text the copy button should copy.
// Highlighting uses every code line together (so multi-line syntax works); output lines stay plain.
// If the language is unknown or Shiki fails, the lines come back unhighlighted instead of throwing.
export async function buildCodeLines(code: string, langRaw: string, meta: CodeMeta): Promise<CodeResult> {
    const raw = langRaw.toLowerCase()
    const lang = aliases[raw] ?? raw
    const parsed = parseLines(code, raw, meta)

    const codeIndexes = parsed.flatMap((line, index) => (['out', 'error', 'warn'].includes(line.kind) ? [] : [index]))
    const tokensByLine = new Map<number, TokenLine>()

    if (lang !== 'text' && codeIndexes.length > 0) {
        try {
            const tokens = await highlightTokens(codeIndexes.map((index) => parsed[index].text).join('\n'), lang)
            codeIndexes.forEach((lineIndex, position) => tokensByLine.set(lineIndex, tokens[position] ?? []))
        } catch {
            tokensByLine.clear()
        }
    }

    const lines = parsed.map((line, index): CodeLine => {
        const tokens = tokensByLine.get(index)
        const segs: Seg[] = tokens
            ? tokens.map((token) => ({ text: token.content, color: token.color, italic: hasStyle(token.fontStyle, 1), bold: hasStyle(token.fontStyle, 2) }))
            : [{ text: line.text }]
        return { kind: line.kind, segs, marker: line.marker, prompt: line.prompt }
    })

    // Copy: commands without prompts or output, added and plain lines without removed ones. A real diff copies as written.
    const copyText = raw === 'diff' ? code : parsed.filter((line) => line.kind === 'code' || line.kind === 'add').map((line) => line.text).join('\n')
    return { lines, copyText }
}