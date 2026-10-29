import { COLLAPSE_AFTER, PREVIEW_LINES, parseMeta } from '@/lib/code-meta'
import { buildCodeLines } from '@/lib/code'
import { CodeFrame } from './CodeFrame'
import styles from './Code.module.css'

type CodeBlockProps = { lang: string; code: string; meta?: string }

// A highlighted code block: parses the fence options, highlights on the server, and renders every line.
export async function CodeBlock({ lang, code, meta = '' }: CodeBlockProps) {
    const options = parseMeta(meta)
    const { lines, copyText } = await buildCodeLines(code, lang, options)
    const collapsible = !options.expanded && lines.length > COLLAPSE_AFTER

    return (
        <CodeFrame label={lang || 'text'} title={options.title} copyText={copyText} hiddenLines={collapsible ? lines.length - PREVIEW_LINES : 0} previewLines={PREVIEW_LINES} digits={String(lines.length).length}>
            {lines.map((line, index) => (
                <span key={index} className={styles.line} data-kind={line.kind} data-hl={options.highlight.has(index + 1) || undefined}>
                    {options.lineNumbers && (
                        <span className={styles.ln} aria-hidden="true">
                            {index + 1}
                        </span>
                    )}
                    {line.marker && (
                        <span className={styles.marker} aria-hidden="true">
                            {line.marker}
                        </span>
                    )}
                    {line.prompt && (
                        <span className={styles.prompt} aria-hidden="true">
                            {line.prompt}
                        </span>
                    )}
                    {line.segs.map((seg, segIndex) => (
                        <span key={segIndex} className={styles.seg} style={{ color: seg.color, fontStyle: seg.italic ? 'italic' : undefined, fontWeight: seg.bold ? 600 : undefined }}>
                            {seg.text}
                        </span>
                    ))}
                </span>
            ))}
        </CodeFrame>
    )
}