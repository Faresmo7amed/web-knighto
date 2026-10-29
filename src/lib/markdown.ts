import type { Element, Root, RootContent } from 'hast'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema, type Options as SanitizeOptions } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified, type PluggableList } from 'unified'
import type { Heading } from './headings'
import { rehypeCallouts } from './rehype-callouts'
import { remarkCodeMeta } from './remark-code-meta'

// What raw HTML may contain. The default list plus details/summary/kbd. No id prefix, so footnote links stay simple.
export const sanitizeSchema: SanitizeOptions = {
    ...defaultSchema,
    clobberPrefix: '',
    tagNames: [...(defaultSchema.tagNames ?? []), 'details', 'summary', 'kbd'],
    attributes: { ...defaultSchema.attributes, details: ['open'], code: [...(defaultSchema.attributes?.code ?? []), 'dataMeta'] },
}

export const remarkRehypeOptions = { allowDangerousHtml: true, clobberPrefix: '' }
export const markdownRemarkPlugins: PluggableList = [remarkGfm, remarkCodeMeta]
export const markdownRehypePlugins: PluggableList = [rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeSlug, rehypeCallouts]

// Plain text inside a node (all text children joined). Use to read code blocks and heading text.
export function toText(node: Root | RootContent): string {
    if (node.type === 'text') return node.value
    if ('children' in node) return node.children.map((child) => toText(child)).join('')
    return ''
}

// Lists the h2-h4 headings of a markdown string with the same ids the renderer produces.
// Use on the server to build "On this page".
export function extractHeadings(markdown: string): Heading[] {
    const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype, remarkRehypeOptions).use(rehypeRaw).use(rehypeSanitize, sanitizeSchema).use(rehypeSlug)
    const tree = processor.runSync(processor.parse(markdown))
    const headings: Heading[] = []

    // Walks the tree and records each h2-h4 (the footnotes label is skipped).
    function collect(parent: Root | Element) {
        for (const child of parent.children) {
            if (child.type !== 'element') continue
            const match = /^h([234])$/.exec(child.tagName)
            const id = child.properties.id
            if (match && typeof id === 'string' && id !== 'footnote-label') {
                headings.push({ id, text: toText(child).trim(), level: Number(match[1]) as 2 | 3 | 4 })
            }
            collect(child)
        }
    }

    collect(tree)
    return headings
}