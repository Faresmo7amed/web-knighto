import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const map = {
    chevronDown: 'chevron-down',
    chevronLeft: 'chevron-left',
    chevronRight: 'chevron-right',
    arrowUp: 'arrow-up',
    arrowDown: 'arrow-down',
    arrowLeft: 'arrow-left',
    arrowRight: 'arrow-right',
    panelLeft: 'panel-left',
}

// Visits every .ts/.tsx file under a folder, except Icon.tsx
function walk(dir) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) walk(full)
        else if (/\.tsx?$/.test(name) && name !== 'Icon.tsx') fix(full)
    }
}

// Rewrites 'oldName' or "oldName" to the kebab-case name
function fix(file) {
    let text = readFileSync(file, 'utf8')
    const before = text
    for (const [from, to] of Object.entries(map)) {
        text = text.replace(new RegExp(`(["'])${from}\\1`, 'g'), `$1${to}$1`)
    }
    if (text !== before) {
        writeFileSync(file, text)
        console.log('updated', file)
    }
}

walk('src')