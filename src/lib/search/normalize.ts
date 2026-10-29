const REMOVED = /[\u064B-\u065F\u0670\u0640]/ // Arabic diacritics and tatweel

// Normalizes one character: drops Arabic marks, unifies alef and ya, strips Latin accents, lowercases.
function normChar(char: string): string {
    if (REMOVED.test(char)) return ''
    if ('أإآٱ'.includes(char)) return 'ا'
    if (char === 'ى') return 'ي'
    return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Returns the normalized text and, for each normalized character, its index in the original text.
// The map lets highlights point at the original text even though normalizing can remove characters.
export function normalizeWithMap(text: string): { norm: string; map: number[] } {
    let norm = ''
    const map: number[] = []
    for (let i = 0; i < text.length; i++) {
        for (const char of normChar(text[i])) {
            norm += char
            map.push(i)
        }
    }
    return { norm, map }
}