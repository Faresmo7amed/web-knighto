import type { ComponentProps } from "react"
import type { Icon } from "@/components/ui/Icon"

export type IconName = ComponentProps<typeof Icon>["name"]
export type NodeKind = "main" | "sub" | "optional" | "alt" | "rec"
export type Resource = { title: string; href: string; type: "docs" | "article" | "video" }
export type RelatedLink = { title: string; href: string }

export type RoadmapNode = {
    id: string
    title: string
    kind: NodeKind
    description: string
    study: string
    resources: Resource[]
    related: RelatedLink[]
    locked?: boolean
}
export type Row = { left?: RoadmapNode; right?: RoadmapNode; choose?: boolean }
export type Group = { label: string; main: RoadmapNode; rows: Row[] }
export type Roadmap = { slug: string; title: string; description: string; category: string; icon: IconName; groups: Group[] }

export type LeanNode = Pick<RoadmapNode, "id" | "title" | "kind" | "locked">
export type LeanGroup = { label: string; main: LeanNode; rows: { left?: LeanNode; right?: LeanNode; choose?: boolean }[] }
export type RoadmapSummary = { slug: string; title: string; description: string; category: string; icon: IconName; ids: string[] }

export const categories = ["All", "Frontend", "Backend", "DevOps", "Languages"]

// Makes a URL-safe id from a title. Used for node ids and the deep link of each step.
function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

// Builds a node with placeholder notes. Use it for steps that have no real content yet.
function step(title: string, kind: NodeKind = "sub", extra: Partial<RoadmapNode> = {}): RoadmapNode {
    return {
        id: slugify(title),
        title,
        kind,
        description: `What to learn about ${title}.`,
        study: `Study notes for **${title}** will go here.`,
        resources: [],
        related: [],
        ...extra,
    }
}

// Builds a row. Use it when a row needs only one side or the "choose one" label.
function row(left?: RoadmapNode, right?: RoadmapNode, choose?: boolean): Row {
    return { left, right, choose }
}

// Builds a whole group from titles, two steps per row. Use it for quick placeholder roadmaps.
function group(label: string, main: string, items: string[]): Group {
    const rows: Row[] = []
    for (let i = 0; i < items.length; i += 2) rows.push(row(step(items[i]), items[i + 1] ? step(items[i + 1]) : undefined))
    return { label, main: step(main, "main"), rows }
}

const jsxStudy = [
    "JSX looks like HTML, but it is JavaScript. Each tag becomes a function call that describes what to show.",
    "",
    "```jsx",
    'const name = "Ada"',
    'const el = <h1 className="title">Hello, {name}</h1>',
    "```",
    "",
    "Remember three rules:",
    "",
    "- Return one root element, or a fragment",
    "- Use `className`, not `class`",
    "- Put JavaScript inside curly braces",
].join("\n")

const react: Roadmap = {
    slug: "react-developer",
    title: "React developer",
    description: "From JSX and state to hooks, routing and frameworks. Select a step to read its notes.",
    category: "Frontend",
    icon: "atom",
    groups: [
        {
            label: "1 · Foundations",
            main: step("JavaScript essentials", "main"),
            rows: [
                row(step("Variables and types"), step("Array methods")),
                row(step("Functions and closures"), step("Async and promises")),
            ],
        },
        {
            label: "2 · React basics",
            main: step("React basics", "main"),
            rows: [
                row(
                    step("JSX", "sub", {
                        description: "The syntax that lets you write markup inside JavaScript.",
                        study: jsxStudy,
                        resources: [
                            { title: "Writing markup with JSX", href: "https://react.dev/learn/writing-markup-with-jsx", type: "docs" },
                            { title: "JSX in depth", href: "https://react.dev/learn", type: "article" },
                            { title: "JSX explained in ten minutes", href: "https://www.youtube.com", type: "video" },
                        ],
                        related: [
                            { title: "Frontend › React", href: "/frontend/react" },
                            { title: "Frontend › JavaScript", href: "/frontend/javascript" },
                        ],
                    }),
                    step("State", "rec")
                ),
                row(step("Components and props"), step("Events")),
                row(undefined, step("Class components", "optional")),
            ],
        },
        {
            label: "3 · Hooks and data",
            main: step("Hooks", "main"),
            rows: [
                row(step("useState"), step("useRef")),
                row(step("useEffect"), step("useMemo")),
                row(step("fetch + useEffect", "alt"), step("TanStack Query", "alt"), true),
            ],
        },
        {
            label: "4 · Beyond the basics",
            main: step("Routing and frameworks", "main"),
            rows: [
                row(step("React Router"), step("Next.js", "rec")),
                row(undefined, step("Server components", "sub", { locked: true })),
            ],
        },
    ],
}

const others: Roadmap[] = [
    {
        slug: "javascript-fundamentals", title: "JavaScript fundamentals", category: "Languages", icon: "code",
        description: "Syntax, functions, objects and async code, in learning order.",
        groups: [
            group("1 · Basics", "Syntax and values", ["Variables", "Types", "Operators", "Control flow"]),
            group("2 · Core ideas", "Functions and objects", ["Functions", "Closures", "Objects", "Arrays"]),
            group("3 · Async", "Asynchronous code", ["Callbacks", "Promises", "async and await", "Event loop"]),
        ],
    },
    {
        slug: "backend-nodejs", title: "Backend with Node.js", category: "Backend", icon: "server",
        description: "Modules, HTTP, Express, databases and auth.",
        groups: [
            group("1 · Node basics", "Node.js core", ["Modules", "File system", "HTTP", "Events"]),
            group("2 · APIs", "Express", ["Routing", "Middleware", "Validation", "Errors"]),
            group("3 · Data", "Databases", ["SQL", "MongoDB", "Auth", "Sessions"]),
        ],
    },
    {
        slug: "devops-basics", title: "DevOps basics", category: "DevOps", icon: "terminal",
        description: "Git, containers, CI pipelines and deployment.",
        groups: [
            group("1 · Version control", "Git", ["Commits", "Branches", "Pull requests", "Rebasing"]),
            group("2 · Containers", "Docker", ["Images", "Containers", "Compose", "Volumes"]),
            group("3 · Delivery", "CI and CD", ["Pipelines", "Testing in CI", "Deploys", "Rollbacks"]),
        ],
    },
    {
        slug: "typescript", title: "TypeScript", category: "Languages", icon: "type",
        description: "Types, generics and typing real-world code.",
        groups: [
            group("1 · Types", "Everyday types", ["Primitives", "Objects", "Unions", "Narrowing"]),
            group("2 · Reuse", "Generics", ["Generic functions", "Constraints", "Utility types", "Mapped types"]),
        ],
    },
    {
        slug: "cloud-fundamentals", title: "Cloud fundamentals", category: "DevOps", icon: "cloud",
        description: "Hosting, storage, networking and managed services.",
        groups: [
            group("1 · Core services", "Compute and storage", ["Servers", "Serverless", "Object storage", "Databases"]),
            group("2 · Networking", "Networking and security", ["DNS", "CDN", "Load balancing", "IAM"]),
        ],
    },
]

export const roadmaps: Roadmap[] = [react, ...others]

// Finds a roadmap by its URL slug, or undefined.
export function getRoadmap(slug: string): Roadmap | undefined {
    return roadmaps.find((r) => r.slug === slug)
}

// Lists every node in reading order: each group's main node, then its rows left to right.
export function flattenNodes(roadmap: Roadmap): RoadmapNode[] {
    return roadmap.groups.flatMap((g) => [g.main, ...g.rows.flatMap((r) => [r.left, r.right].filter((n): n is RoadmapNode => Boolean(n)))])
}

// Finds one node by id, or undefined. Use it in the route to open the details panel.
export function findRoadmapNode(roadmap: Roadmap, id: string): RoadmapNode | undefined {
    return flattenNodes(roadmap).find((n) => n.id === id)
}

// Returns the previous and next node in reading order. Use it for the panel buttons.
export function getNeighbors(roadmap: Roadmap, id: string) {
    const list = flattenNodes(roadmap)
    const i = list.findIndex((n) => n.id === id)
    return { prev: list[i - 1], next: list[i + 1] }
}

// Small card data for the list page: no study text, so the client payload stays light.
export function getRoadmapSummaries(): RoadmapSummary[] {
    return roadmaps.map((r) => ({
        slug: r.slug, title: r.title, description: r.description, category: r.category, icon: r.icon,
        ids: flattenNodes(r).map((n) => n.id),
    }))
}

// Light copy of the tree (titles and kinds only) for the client tree. Study text stays on the server.
export function toTreeData(roadmap: Roadmap): LeanGroup[] {
    const lean = (n?: RoadmapNode): LeanNode | undefined => (n ? { id: n.id, title: n.title, kind: n.kind, locked: n.locked } : undefined)
    return roadmap.groups.map((g) => ({
        label: g.label,
        main: lean(g.main) as LeanNode,
        rows: g.rows.map((r) => ({ left: lean(r.left), right: lean(r.right), choose: r.choose })),
    }))
}