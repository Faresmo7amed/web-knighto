// Scrolls the page to a Y position, smoothly unless the visitor asked for reduced motion.
export function scrollPageTo(top: number) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}