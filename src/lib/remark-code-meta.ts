import type { Parent, Root, RootContent } from 'mdast'

// Walks the markdown tree and finds fenced code blocks.
function walk(node: Root | Parent) {
    for (const child of node.children as RootContent[]) {
        if (child.type === 'code' && child.meta) {
            const data = (child.data ??= {}) as { hProperties?: Record<string, unknown> }
            data.hProperties = { ...data.hProperties, dataMeta: child.meta }
        }
        if ('children' in child) walk(child as Parent)
    }
}

// Copies the text after the language on a fence line onto the <code> element as data-meta.
// Raw-HTML handling would otherwise throw it away. Used as a remark plugin.
export function remarkCodeMeta() {
    return (tree: Root) => {
        walk(tree)
    }
}