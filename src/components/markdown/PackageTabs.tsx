import { buildCodeLines } from '@/lib/code'
import { parseMeta } from '@/lib/code-meta'
import { convertBlock, packageManagers } from '@/lib/package-commands'
import { PackageTabsFrame } from './PackageTabsFrame'
import styles from './Code.module.css'

// Renders one highlighted body per package manager, then lets the client frame choose which to show.
export async function PackageTabs({ lang, code, meta = '' }: { lang: string; code: string; meta?: string }) {
    const options = parseMeta(meta)
    const tabs = await Promise.all(
        packageManagers.map(async (manager) => {
            const converted = convertBlock(code, manager)
            const { lines, copyText } = await buildCodeLines(converted, lang, options)
            const content = lines.map((line, index) => (
                <span key={index} className={styles.line} data-kind={line.kind}>
                    {line.prompt && (
                        <span className={styles.prompt} aria-hidden="true">
                            {line.prompt}
                        </span>
                    )}
                    {line.segs.map((seg, segIndex) => (
                        <span key={segIndex} className={styles.seg} style={{ color: seg.color }}>
                            {seg.text}
                        </span>
                    ))}
                </span>
            ))
            return { id: manager.id, label: manager.label, copyText, content }
        }),
    )
    return <PackageTabsFrame tabs={tabs} />
}