import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import type { Element } from 'hast'
import type { Components, ExtraProps } from 'react-markdown'
import { Icon, type IconName } from '@/components/ui/Icon'
import { toText } from '@/lib/markdown'
import { CodeBlock } from './CodeBlock'
import { FileTree } from './FileTree'
import { ZoomImage } from './ZoomImage'
import styles from './Markdown.module.css'
import { isPackageBlock } from '@/lib/package-commands'
import { PackageTabs } from './PackageTabs'

const callouts: Record<string, { icon: IconName; title: string }> = {
    note: { icon: 'note', title: 'Note' },
    tip: { icon: 'lightbulb', title: 'Tip' },
    warning: { icon: 'warning', title: 'Warning' },
    danger: { icon: 'danger', title: 'Danger' },
    info: { icon: 'info', title: 'Info' },
}

// Builds the h2/h3/h4 override: the heading plus a "#" link that shows on hover or focus.
function makeHeading(Tag: 'h2' | 'h3' | 'h4') {
    return function Heading({ id, children }: ComponentPropsWithoutRef<'h2'>) {
        return (
            <Tag id={id}>
                <span>{children}</span>
                {id && id !== 'footnote-label' && (
                    <a href={`#${id}`} className={styles.anchor} aria-label="Link to this heading">
                        #
                    </a>
                )}
            </Tag>
        )
    }
}

type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'> & ExtraProps & { 'data-callout'?: string; 'data-title'?: string }

// Plain blockquote, designed quote, or callout, depending on the marker the plugin found.
function Blockquote(props: BlockquoteProps) {
    const type = props['data-callout']
    const title = props['data-title']

    if (type === 'quote') {
        return (
            <figure className={styles.quote}>
                <blockquote>{props.children}</blockquote>
                {title && <figcaption>{title}</figcaption>}
            </figure>
        )
    }
    const callout = type ? callouts[type] : undefined
    if (callout) {
        return (
            <div className={styles.callout} data-type={type} role="note">
                <span className={styles.calloutIcon}>
                    <Icon name={callout.icon} size={20} />
                </span>
                <div className={styles.calloutBody}>
                    <b className={styles.calloutTitle}>{title || callout.title}</b>
                    {props.children}
                </div>
            </div>
        )
    }
    return <blockquote>{props.children}</blockquote>
}

// Code blocks: ```tree becomes a file tree, everything else goes to CodeBlock.
function Pre({ node, children }: ComponentPropsWithoutRef<'pre'> & ExtraProps) {
    const code = node?.children.find((child): child is Element => child.type === 'element' && child.tagName === 'code')
    if (!code) return <pre>{children}</pre>

    const className = code.properties.className
    const lang = Array.isArray(className) ? String(className[0] ?? '').replace('language-', '') : ''
    const text = toText(code).replace(/\n$/, '')
    if (lang === 'tree') return <FileTree code={text} />
    const meta = typeof code.properties.dataMeta === 'string' ? code.properties.dataMeta : ''
    if (isPackageBlock(lang, text, meta)) return <PackageTabs lang={lang} code={text} meta={meta} />
    return <CodeBlock lang={lang} code={text} meta={meta} />
}

// Wide tables scroll inside their own box, so the page never scrolls sideways.
function Table({ children }: ComponentPropsWithoutRef<'table'>) {
    return (
        <div className={styles.tableWrap} role="region" aria-label="Table" tabIndex={0}>
            <table>{children}</table>
        </div>
    )
}

// A paragraph that holds only an image becomes a div, because a figure cannot live inside a <p>.
function Paragraph({ node, children }: ComponentPropsWithoutRef<'p'> & ExtraProps) {
    const first = node?.children[0]
    const onlyImage = node?.children.length === 1 && first?.type === 'element' && first.tagName === 'img'
    return onlyImage ? <div>{children}</div> : <p>{children}</p>
}

// Internal links use next/link, # links stay plain, outside links open in a new tab.
function Anchor({ node, href, children, ...rest }: ComponentPropsWithoutRef<'a'> & ExtraProps) {
    void node // react-markdown passes it, but it must not reach the DOM
    if (!href) return <a {...rest}>{children}</a>
    if (href.startsWith('/')) {
        return (
            <Link href={href} {...rest}>
                {children}
            </Link>
        )
    }
    if (href.startsWith('#')) {
        return (
            <a href={href} {...rest}>
                {children}
            </a>
        )
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
            {children}
        </a>
    )
}

// The markdown title ("Caption") becomes the figure caption.
function Img({ src, alt, title }: ComponentPropsWithoutRef<'img'>) {
    if (typeof src !== 'string') return null
    return <ZoomImage src={src} alt={alt ?? ''} caption={title} />
}

export const markdownComponents: Components = {
    h2: makeHeading('h2'),
    h3: makeHeading('h3'),
    h4: makeHeading('h4'),
    blockquote: Blockquote,
    pre: Pre,
    table: Table,
    p: Paragraph,
    a: Anchor,
    img: Img,
}