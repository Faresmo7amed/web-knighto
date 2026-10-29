export type CheatRow = {
    method: string
    does: string
    returns: string
    mutates?: boolean
}

export type CheatGroup = {
    id: string
    title: string
    rows: CheatRow[]
}

export const sampleCheatSheet = {
    title: "Array methods cheat sheet",
    lead: "The array methods you reach for most, grouped by what you want to do, with what each one returns.",
    author: "[Author name]",
    updated: "Oct 8, 2026",
    minutes: 3,
    tags: ["javascript", "cheat sheet"],
    callout: {
        title: "Mutating methods",
        text: "These change the original array: push, pop, shift, unshift, splice, sort and reverse. Everything else returns a new value.",
    },
    groups: [
        {
            id: "add",
            title: "Add and remove",
            rows: [
                { method: "push(x)", does: "Add to the end", returns: "new length", mutates: true },
                { method: "pop()", does: "Remove the last item", returns: "removed item", mutates: true },
                { method: "unshift(x)", does: "Add to the start", returns: "new length", mutates: true },
                { method: "shift()", does: "Remove the first item", returns: "removed item", mutates: true },
                { method: "splice(i, n)", does: "Remove or replace in place", returns: "removed items", mutates: true },
            ],
        },
        {
            id: "search",
            title: "Search and test",
            rows: [
                { method: "includes(x)", does: "Does it contain x?", returns: "boolean" },
                { method: "indexOf(x)", does: "First position of x", returns: "index or -1" },
                { method: "find(fn)", does: "First item that matches", returns: "item or undefined" },
                { method: "findIndex(fn)", does: "Position of first match", returns: "index or -1" },
                { method: "some(fn) / every(fn)", does: "Any / all pass the test", returns: "boolean" },
            ],
        },
        {
            id: "transform",
            title: "Transform",
            rows: [
                { method: "map(fn)", does: "Result of fn for each item", returns: "new array" },
                { method: "filter(fn)", does: "Keep items that pass", returns: "new array" },
                { method: "reduce(fn, init)", does: "Fold into one value", returns: "any value" },
                { method: "sort(fn)", does: "Order the items", returns: "same array", mutates: true },
                { method: "reverse()", does: "Flip the order", returns: "same array", mutates: true },
            ],
        },
        {
            id: "combine",
            title: "Combine and slice",
            rows: [
                { method: "slice(a, b)", does: "Copy a range", returns: "new array" },
                { method: "concat(b)", does: "Join two arrays", returns: "new array" },
                { method: "flat(depth)", does: "Unwrap nested arrays", returns: "new array" },
                { method: "join(sep)", does: "Turn into a string", returns: "string" },
                { method: "[...a, ...b]", does: "Spread into a copy", returns: "new array" },
            ],
        },
    ] as CheatGroup[],
    chain: {
        file: "chain.js",
        code: `const names = users
    .filter((u) => u.active)
    .map((u) => u.name)
    .sort()`,
    },
    prev: { title: "Looping", href: "/frontend/javascript/arrays" },
    next: { title: "Sorting", href: "/frontend/javascript/arrays" },
}