import type { Element, Root } from 'hast'

const MARKER = /^\[!(NOTE|TIP|WARNING|DANGER|INFO|QUOTE)\][ \t]*([^\n]*)\n?/i

// Turns a blockquote whose first line is "[!NOTE] Title" into a blockquote tagged with data-callout and data-title.
// The renderer reads those two attributes. A blockquote without the marker is left alone.
function convert(blockquote: Element) {
    const paragraph = blockquote.children.find((child): child is Element => child.type === 'element')
    if (!paragraph || paragraph.tagName !== 'p') return
    const first = paragraph.children[0]
    if (!first || first.type !== 'text') return
    const match = MARKER.exec(first.value)
    if (!match) return

    first.value = first.value.slice(match[0].length)
    if (first.value === '') paragraph.children.shift()
    if (paragraph.children.length === 0) blockquote.children = blockquote.children.filter((child) => child !== paragraph)

    blockquote.properties = { ...blockquote.properties, dataCallout: match[1].toLowerCase(), dataTitle: match[2].trim() }
}

// Walks the tree and converts every callout blockquote. Used as a rehype plugin.
function walk(parent: Root | Element) {
    for (const child of parent.children) {
        if (child.type !== 'element') continue
        if (child.tagName === 'blockquote') convert(child)
        walk(child)
    }
}

export function rehypeCallouts() {
    return (tree: Root) => {
        walk(tree)
    }
}