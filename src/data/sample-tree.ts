import type { IconName } from '@/components/ui/Icon'

export type TreeBadge = 'New' | 'Updated'

export type TreeNode = {
    slug: string // URL segment, unique among siblings
    title: string
    icon?: IconName // shown in column 1 only
    badge?: TreeBadge
    children?: TreeNode[]
    description?: string
    banner?: string
}

export type TreeSection = {
    slug: string
    title: string
    children: TreeNode[]
    description?: string
}

export const sampleTree: TreeSection[] = [
    {
        slug: 'frontend',
        title: 'Frontend',
        children: [
            { slug: 'html', title: 'HTML', icon: 'code' },
            { slug: 'css', title: 'CSS', icon: 'layers' },
            {
                slug: 'javascript',
                title: 'JavaScript',
                icon: 'js',
                children: [
                    { slug: 'introduction', title: 'Introduction' },
                    {
                        slug: 'syntax',
                        title: 'Syntax',
                        children: [
                            { slug: 'variables', title: 'Variables' },
                            { slug: 'data-types', title: 'Data types' },
                            { slug: 'operators', title: 'Operators' },
                        ],
                    },
                    {
                        slug: 'functions',
                        title: 'Functions',
                        children: [
                            { slug: 'declarations', title: 'Declarations' },
                            { slug: 'arrow-functions', title: 'Arrow functions' },
                            {
                                slug: 'closures',
                                title: 'Closures',
                                children: [
                                    { slug: 'what-a-closure-is', title: 'What a closure is' },
                                    { slug: 'why-it-matters', title: 'Why it matters' },
                                    { slug: 'private-state', title: 'Private state' },
                                    { slug: 'common-mistake', title: 'A common mistake' },
                                    { slug: 'real-world-uses', title: 'Real-world uses and long titles that truncate' },
                                ],
                            },
                            { slug: 'callbacks', title: 'Callbacks' },
                            { slug: 'recursion', title: 'Recursion', badge: 'Updated' },
                            { slug: 'higher-order-functions', title: 'Higher-order functions and their patterns' },
                        ],
                    },
                    {
                        slug: 'objects',
                        title: 'Objects',
                        children: [
                            { slug: 'syntax', title: 'Syntax' },
                            { slug: 'destructuring', title: 'Destructuring' },
                            {
                                slug: 'properties',
                                title: 'Properties',
                                children: [
                                    { slug: 'object-keys', title: 'Object.keys()' },
                                    { slug: 'object-values', title: 'Object.values()' },
                                    { slug: 'object-entries', title: 'Object.entries()' },
                                ],
                            },
                        ],
                    },
                    {
                        slug: 'arrays',
                        title: 'Arrays',
                        children: [
                            { slug: 'methods', title: 'Array methods' },
                            { slug: 'iteration', title: 'Iteration' },
                        ],
                    },
                    { slug: 'asynchronous-code', title: 'Asynchronous code', badge: 'New' },
                ],
            },
            {
                slug: 'react',
                title: 'React',
                icon: 'react',
                children: [
                    { slug: 'introduction', title: 'Introduction' },
                    { slug: 'components', title: 'Components' },
                    {
                        slug: 'hooks',
                        title: 'Hooks',
                        children: [
                            { slug: 'use-state', title: 'useState' },
                            { slug: 'use-effect', title: 'useEffect' },
                        ],
                    },
                ],
            },
            {
                slug: 'typescript',
                title: 'TypeScript',
                icon: 'ts',
                children: [
                    { slug: 'introduction', title: 'Introduction' },
                    { slug: 'types', title: 'Types' },
                ],
            },
        ],
    },
    {
        slug: 'backend',
        title: 'Backend',
        children: [
            {
                slug: 'nodejs',
                title: 'Node.js',
                icon: 'server',
                children: [
                    {
                        slug: 'modules',
                        title: 'Modules',
                        children: [
                            { slug: 'fs', title: 'fs' },
                            { slug: 'path', title: 'path' },
                            {
                                slug: 'http',
                                title: 'http',
                                children: [
                                    { slug: 'create-server', title: 'createServer()' },
                                    { slug: 'request', title: 'request()' },
                                ],
                            },
                        ],
                    },
                ],
            },
            { slug: 'expressjs', title: 'Express.js', icon: 'server' },
            { slug: 'nestjs', title: 'Nest.js', icon: 'server' },
            { slug: 'mongodb', title: 'MongoDB', icon: 'layers' },
        ],
    },
]

// Finds one section by its URL slug. Use in layouts and pages.
export function getSection(slug: string): TreeSection | undefined {
    return sampleTree.find((section) => section.slug === slug)
}