import Markdown from 'react-markdown'
import { markdownRehypePlugins, markdownRemarkPlugins, remarkRehypeOptions } from '@/lib/markdown'
import { markdownComponents } from './markdown-components'
import styles from './Markdown.module.css'

// Renders a markdown string with the site's styles. Use for articles and, later, roadmap study content.
export function MarkdownRenderer({ markdown }: { markdown: string }) {
    return (
        <div className={`prose ${styles.md}`}>
            <Markdown remarkPlugins={markdownRemarkPlugins} rehypePlugins={markdownRehypePlugins} remarkRehypeOptions={remarkRehypeOptions} components={markdownComponents}>
                {markdown}
            </Markdown>
        </div>
    )
}