// Turns a title into a URL name. Arabic-only titles fall back to "page", and the owner can edit the slug.
export function slugify(text: string) {
    return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'page'
}

// Adds -2, -3... until the slug is not in `taken`. Use when creating a page.
export function uniqueSlug(base: string, taken: string[]) {
    if (!taken.includes(base)) return base
    let n = 2
    while (taken.includes(`${base}-${n}`)) n += 1
    return `${base}-${n}`
}