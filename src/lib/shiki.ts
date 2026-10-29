import { createHighlighter, type Highlighter } from 'shiki'
import { siteTheme } from './shiki-theme'

// Languages loaded once. Add a name here to support another language.
const langs = ['javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'yaml', 'markdown', 'bash', 'powershell', 'python', 'c', 'cpp', 'csharp', 'java', 'go', 'rust', 'php', 'sql', 'dockerfile', 'diff']

let instance: Promise<Highlighter> | undefined

// Returns the shared highlighter, creating it on first use. Loading takes a moment, so it is created only once.
export function getHighlighter(): Promise<Highlighter> {
    instance ??= createHighlighter({ themes: [siteTheme], langs })
    return instance
}