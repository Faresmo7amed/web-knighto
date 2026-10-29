import type { ReactNode } from 'react'

// Stroke paths copied from the design files. Names are kebab-case only.
const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    'chevron-down': <path d="M6 9l6 6 6-6" />,
    'chevron-left': <path d="M15 6l-6 6 6 6" />,
    'chevron-right': <path d="M9 6l6 6-6 6" />,
    'arrow-up': <path d="M12 19V5M5 12l7-7 7 7" />,
    'arrow-down': <path d="M12 5v14M5 12l7 7 7-7" />,
    'arrow-left': <path d="M19 12H5M12 5l-7 7 7 7" />,
    'arrow-right': <path d="M5 12h14M12 5l7 7-7 7" />,
    link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    rss: <><path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8" /><circle cx="6" cy="18" r="1" /></>,
    code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />,
    layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
    js: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M10 10v5a2 2 0 0 1-3 1M14 15a2 2 0 0 0 3 1 2 2 0 0 0-2-3 2 2 0 0 1-1-2 2 2 0 0 1 3-1" /></>,
    react: <><circle cx="12" cy="12" r="1.5" /><ellipse cx="12" cy="12" rx="9" ry="3.5" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" /></>,
    atom: <><circle cx="12" cy="12" r="1.5" /><ellipse cx="12" cy="12" rx="9" ry="3.5" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" /></>,
    ts: <path d="M4 6h16M12 6v13" />,
    type: <path d="M4 6h16M12 6v13" />,
    server: <><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01" /></>,
    pin: <><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></>,
    'panel-left': <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    printer: <><path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2" /><rect x="7" y="14" width="10" height="6" /></>,
    list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    note: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h7" /></>,
    'file-text': <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h7" /></>,
    lightbulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />,
    bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />,
    warning: <><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></>,
    'triangle-alert': <><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></>,
    danger: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    'circle-alert': <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>,
    'circle-check': <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>,
    'circle-play': <><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5 3.5-5 3.5z" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    wrench: <path d="M14.5 6.5a4 4 0 0 0 5 5L10 21l-4-4 9.5-9.5a4 4 0 0 0-1-1z" />,
    cloud: <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z" />,
    terminal: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z" />,
} satisfies Record<string, ReactNode>

type CanonicalIconName = keyof typeof paths

// Earlier components used the design file's camelCase labels. Keep those labels valid
// at this boundary so both naming styles render the same shared SVG.
const legacyNames = {
    chevronDown: 'chevron-down',
    chevronLeft: 'chevron-left',
    chevronRight: 'chevron-right',
    arrowUp: 'arrow-up',
    arrowDown: 'arrow-down',
    arrowLeft: 'arrow-left',
    arrowRight: 'arrow-right',
} as const satisfies Record<string, CanonicalIconName>

// One list of accepted names, including the older aliases while the app is migrated.
export type IconName = CanonicalIconName | keyof typeof legacyNames

// Arrows and chevrons that point sideways. rtl.css mirrors them on right-to-left pages.
const FLIP_ICONS = new Set<IconName>([
    'chevron-left', 'chevron-right', 'arrow-left', 'arrow-right',
    'chevronLeft', 'chevronRight', 'arrowLeft', 'arrowRight',
])

// Draws one icon by name. Use for every decorative icon; the parent button carries the aria-label.
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
    const canonicalName = legacyNames[name as keyof typeof legacyNames] ?? name as CanonicalIconName
    return (
        <svg aria-hidden="true" data-flip={FLIP_ICONS.has(name) ? '' : undefined} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {paths[canonicalName]}
        </svg>
    )
}
