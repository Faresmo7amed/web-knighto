import { packageManagers, type PackageManager } from '@/data/package-managers'

const SOURCE = /^(?:\$ )?(npm|npx|pnpm|yarn|bun|bunx)\b/
const SHELL = new Set(['bash', 'sh', 'shell', 'zsh', 'console', 'terminal', 'git-bash', 'gitbash'])

// Rewrites one npm-style line for another manager. Returns the line unchanged if it is not a recognised command.
export function convertCommand(line: string, manager: PackageManager): string {
    const prompt = line.startsWith('$ ') ? '$ ' : ''
    const body = line.slice(prompt.length).trim()
    const words = body.split(/\s+/)
    const tool = words[0]
    const rest = words.slice(1)

    if (tool === 'npx' || tool === 'bunx') return `${prompt}${manager.exec} ${rest.join(' ')}`.trim()

    const sub = rest[0]
    if (sub === 'install' || sub === 'i' || sub === 'add') {
        const args = rest.slice(1)
        if (args.length === 0) return `${prompt}${manager.install}`
        const mapped = manager.id === 'bun' ? args.map((arg) => (arg === '-D' || arg === '--save-dev' ? '-d' : arg)) : args.map((arg) => (arg === '--save-dev' ? '-D' : arg))
        return `${prompt}${manager.installPkg} ${mapped.join(' ')}`
    }
    if (sub === 'uninstall' || sub === 'remove' || sub === 'rm') return `${prompt}${manager.uninstall} ${rest.slice(1).join(' ')}`.trim()
    if (sub === 'run') return `${prompt}${manager.run} ${rest.slice(1).join(' ')}`.trim()
    return `${prompt}${manager.id} ${rest.join(' ')}`.trim()
}

// True when the block is a shell block made only of package-manager commands, so tabs make sense.
export function isPackageBlock(lang: string, code: string, meta: string): boolean {
    if (!SHELL.has(lang.toLowerCase()) || /\bnotabs\b/.test(meta)) return false
    const lines = code.split('\n').filter((line) => line.trim() !== '')
    return lines.length > 0 && lines.every((line) => SOURCE.test(line.trim()))
}

// The whole block converted for one manager.
export function convertBlock(code: string, manager: PackageManager): string {
    return code.split('\n').map((line) => (line.trim() === '' ? line : convertCommand(line.trim(), manager))).join('\n')
}

export { packageManagers }