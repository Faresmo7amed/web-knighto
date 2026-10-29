import type { IconName } from '@/components/ui/Icon'

export type HomeSection = { slug: string; title: string; description: string; icon: IconName }
export type HomeArticle = { href: string; path: string; title: string; excerpt: string; meta: string }
export type HomeRoadmap = { href: string; title: string; description: string; topicCount: number }

export const homeSections: HomeSection[] = [
    { slug: 'programming', title: 'Programming', description: 'Core ideas that apply to any language.', icon: 'layers' },
    { slug: 'frontend', title: 'Frontend', description: 'HTML, CSS, JavaScript and frameworks.', icon: 'code' },
    { slug: 'backend', title: 'Backend', description: 'Servers, APIs, databases and auth.', icon: 'server' },
    { slug: 'fullstack', title: 'Fullstack', description: 'Building a whole app end to end.', icon: 'layers' },
    { slug: 'devops', title: 'DevOps', description: 'Builds, containers and deployment.', icon: 'terminal' },
    { slug: 'cloud', title: 'Cloud', description: 'Hosting, storage and managed services.', icon: 'cloud' },
    { slug: 'languages', title: 'Languages', description: 'Syntax and idioms, language by language.', icon: 'globe' },
    { slug: 'technologies', title: 'Technologies', description: 'Frameworks and platforms in depth.', icon: 'react' },
    { slug: 'concepts', title: 'Concepts', description: 'Patterns and ideas explained simply.', icon: 'bulb' },
    { slug: 'tools', title: 'Tools', description: 'Editors, CLIs and everyday helpers.', icon: 'wrench' },
]

export const homeArticles: HomeArticle[] = [
    { href: '/frontend/javascript/functions/closures', path: 'JavaScript › Functions', title: 'Closures, explained', excerpt: 'How a function keeps the variables around it alive.', meta: '6 min read · Oct 8' },
    { href: '/frontend/javascript/asynchronous-code', path: 'JavaScript › Asynchronous code', title: 'Promises and async functions', excerpt: 'Reading and writing code that waits.', meta: '9 min read · Oct 6' },
    { href: '/frontend/css', path: 'CSS › Layout', title: 'Flexbox layout', excerpt: 'One-dimensional layout, from the main axis up.', meta: '7 min read · Oct 3' },
]

export const homeRoadmaps: HomeRoadmap[] = [
    { href: '/roadmaps/react-developer', title: 'React developer', description: 'From JSX to server components.', topicCount: 16 },
    { href: '/roadmaps/backend-nodejs', title: 'Backend with Node.js', description: 'Modules, HTTP, Express and databases.', topicCount: 15 },
    { href: '/roadmaps/devops-basics', title: 'DevOps basics', description: 'Git, containers and CI pipelines.', topicCount: 15 },
]
