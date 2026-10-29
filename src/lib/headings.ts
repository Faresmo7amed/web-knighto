export type Heading = { id: string; text: string; level: 2 | 3 | 4 }

// Estimated minutes to read, at 200 words per minute. Never less than 1.
export function readingMinutes(markdown: string): number {
    const words = markdown.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
}