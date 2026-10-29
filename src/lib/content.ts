import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Placeholder article details. Step 12c reads these from the database.
export const sampleMeta = {
    subtitle: 'How a function keeps the variables around it alive, and why that is useful.',
    published: 'Oct 2, 2026',
    updated: 'Oct 8, 2026',
    tags: ['javascript', 'scope'],
}

// Reads content/sample.md. Server only. Use inside a component that sits in <Suspense>.
export async function getSampleMarkdown(): Promise<string> {
    return readFile(path.join(process.cwd(), 'content', 'sample.md'), 'utf8')
}