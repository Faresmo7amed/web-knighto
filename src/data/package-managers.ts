export type PackageManager = { id: string; label: string; install: string; installPkg: string; uninstall: string; run: string; exec: string }

// One entry per tab. Add an entry to add a manager. Patterns:
// install = no packages, installPkg = with packages, run = a script, exec = run a package binary.
export const packageManagers: PackageManager[] = [
    { id: 'npm', label: 'npm', install: 'npm install', installPkg: 'npm install', uninstall: 'npm uninstall', run: 'npm run', exec: 'npx' },
    { id: 'pnpm', label: 'pnpm', install: 'pnpm install', installPkg: 'pnpm add', uninstall: 'pnpm remove', run: 'pnpm run', exec: 'pnpm dlx' },
    { id: 'yarn', label: 'yarn', install: 'yarn install', installPkg: 'yarn add', uninstall: 'yarn remove', run: 'yarn', exec: 'yarn dlx' },
    { id: 'bun', label: 'bun', install: 'bun install', installPkg: 'bun add', uninstall: 'bun remove', run: 'bun run', exec: 'bunx' },
]

export const defaultManagerId = 'npm'