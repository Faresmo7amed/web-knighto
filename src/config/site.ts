// Placeholders from the design live here, never inside components.
export type SocialIcon = 'link' | 'mail' | 'rss'

type SocialLink = { id: string; label: string; href: string; icon: SocialIcon }
type NavLink = { label: string; href: string }
export type SiteLocale = {
    code: 'en' | 'ar'
    label: string
    direction: 'ltr' | 'rtl'
}

const socialLinks: SocialLink[] = [
    { id: 'link', label: 'Link', href: '#', icon: 'link' },
    { id: 'email', label: 'Email', href: '#', icon: 'mail' },
    { id: 'rss', label: 'RSS', href: '#', icon: 'rss' },
]

// Shown directly in the nav bar
const navLinks: NavLink[] = [
    { label: 'Frontend', href: '/frontend' },
    { label: 'Backend', href: '/backend' },
    { label: 'DevOps', href: '/devops' },
    { label: 'Cloud', href: '/cloud' },
    { label: 'Tools', href: '/tools' },
]

// Overflow, shown inside the "More" menu
const moreLinks: NavLink[] = [
    { label: 'Programming', href: '/programming' },
    { label: 'Fullstack', href: '/fullstack' },
    { label: 'Languages', href: '/languages' },
    { label: 'Technologies', href: '/technologies' },
    { label: 'Concepts', href: '/concepts' },
]

// Add or remove a locale here. The language control hides itself for one locale.
const locales: SiteLocale[] = [
    { code: 'en', label: 'English', direction: 'ltr' },
    { code: 'ar', label: 'العربية', direction: 'rtl' },
]

export const siteConfig = {
    name: 'Web KNighto',
    ownerName: 'Fares Mohamed',
    description: 'Notes, guides and roadmaps for learning to build the web',
    defaultLocale: 'en',
    locales,
    socialLinks,
    navLinks,
    moreLinks,
        copyrightYear: 2026,
    legalUpdated: "October 13, 2026",
    legalDraft: true,
    cookieNotice: true,
    contactEmail: "faresmo7amed2003@gmail.com",
    ownerRole: "Full-stack Web Developer Self-learner",
    ownerInitials: "AB",
    aboutMe: "I love anything Vanilla, I wanna make you admire the web",
    legalLinks: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Copyright", href: "/copyright" },
    ],
}
