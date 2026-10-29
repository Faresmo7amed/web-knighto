This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
knowledge-site
├─ AGENTS.md
├─ content
│  └─ sample.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ public
│  ├─ helmet.png
│  └─ sample-image.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.module.css
│  │  ├─ page.tsx
│  │  ├─ roadmaps
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ [[...node]]
│  │  │        └─ page.tsx
│  │  ├─ search
│  │  │  ├─ page.tsx
│  │  │  └─ search.module.css
│  │  ├─ terms
│  │  │  └─ page.tsx
│  │  └─ [section]
│  │     ├─ layout.tsx
│  │     └─ [[...slug]]
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ article
│  │  │  ├─ ArticleContent.module.css
│  │  │  ├─ ArticleFooter.tsx
│  │  │  ├─ ArticleHeader.tsx
│  │  │  ├─ ArticleShell.module.css
│  │  │  ├─ ArticleShell.tsx
│  │  │  ├─ OnThisPage.module.css
│  │  │  ├─ OnThisPage.tsx
│  │  │  ├─ ReadingProgressBar.tsx
│  │  │  ├─ RightSidebar.module.css
│  │  │  ├─ RightSidebar.tsx
│  │  │  ├─ ScrollButton.tsx
│  │  │  ├─ TocSheet.tsx
│  │  │  └─ use-article-scroll.ts
│  │  ├─ cheatsheet
│  │  │  ├─ CheatGroupCard.tsx
│  │  │  ├─ CheatSheet.module.css
│  │  │  ├─ CheatSheetPage.tsx
│  │  │  └─ PrintButton.tsx
│  │  ├─ home
│  │  │  ├─ HeroSearchHint.tsx
│  │  │  └─ Home.module.css
│  │  ├─ layout
│  │  │  ├─ CookieNotice.module.css
│  │  │  ├─ CookieNotice.tsx
│  │  │  ├─ Footer.module.css
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Navbar.module.css
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ NavLink.tsx
│  │  │  ├─ PageLayout.module.css
│  │  │  └─ PageLayout.tsx
│  │  ├─ markdown
│  │  │  ├─ Code.module.css
│  │  │  ├─ CodeBlock.tsx
│  │  │  ├─ CodeFrame.tsx
│  │  │  ├─ FileTree.tsx
│  │  │  ├─ markdown-components.tsx
│  │  │  ├─ Markdown.module.css
│  │  │  ├─ MarkdownRenderer.tsx
│  │  │  ├─ PackageTabs.tsx
│  │  │  ├─ PackageTabsFrame.tsx
│  │  │  ├─ ZoomImage.module.css
│  │  │  └─ ZoomImage.tsx
│  │  ├─ progress
│  │  │  ├─ ActivityHeatmap.tsx
│  │  │  ├─ CompactProgress.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ Progress.module.css
│  │  │  ├─ ProgressPage.tsx
│  │  │  ├─ ReadTracker.tsx
│  │  │  ├─ SectionCard.tsx
│  │  │  └─ SidebarProgress.tsx
│  │  ├─ roadmap
│  │  │  ├─ Legend.tsx
│  │  │  ├─ NodePanel.tsx
│  │  │  ├─ PanelFrame.tsx
│  │  │  ├─ Roadmap.module.css
│  │  │  ├─ RoadmapCard.tsx
│  │  │  ├─ RoadmapPanel.module.css
│  │  │  ├─ RoadmapProgress.tsx
│  │  │  ├─ Roadmaps.module.css
│  │  │  ├─ RoadmapsList.tsx
│  │  │  ├─ RoadmapTree.tsx
│  │  │  ├─ RoadmapView.tsx
│  │  │  └─ StepNode.tsx
│  │  ├─ search
│  │  │  ├─ Highlight.module.css
│  │  │  ├─ Highlight.tsx
│  │  │  ├─ PaletteDialog.tsx
│  │  │  ├─ Search.module.css
│  │  │  └─ SearchPalette.tsx
│  │  ├─ section
│  │  │  ├─ FollowMe.tsx
│  │  │  ├─ LandingCard.tsx
│  │  │  ├─ LandingList.tsx
│  │  │  ├─ SectionLanding.module.css
│  │  │  └─ SectionLanding.tsx
│  │  ├─ sidebar
│  │  │  ├─ Chevron.tsx
│  │  │  ├─ MobileDrawer.tsx
│  │  │  ├─ MobileNav.module.css
│  │  │  ├─ MobileSectionNav.tsx
│  │  │  ├─ NestedSidebar.module.css
│  │  │  ├─ NestedSidebar.tsx
│  │  │  ├─ SectionSidebar.tsx
│  │  │  ├─ SidebarColumn.tsx
│  │  │  ├─ SidebarColumns.tsx
│  │  │  ├─ SidebarRail.tsx
│  │  │  ├─ tree-utils.ts
│  │  │  └─ useFullColumnCount.ts
│  │  ├─ static
│  │  │  ├─ Contact.module.css
│  │  │  ├─ ContactForm.tsx
│  │  │  ├─ LegalPage.tsx
│  │  │  ├─ LegalToc.tsx
│  │  │  ├─ Static.module.css
│  │  │  ├─ StaticShell.tsx
│  │  │  └─ StatusPage.module.css
│  │  ├─ theme
│  │  │  ├─ ThemeProvider.tsx
│  │  │  └─ ThemeToggle.tsx
│  │  ├─ topic
│  │  │  ├─ TopicChildCard.tsx
│  │  │  ├─ TopicPage.module.css
│  │  │  └─ TopicPage.tsx
│  │  └─ ui
│  │     ├─ Icon.tsx
│  │     ├─ ProgressBar.module.css
│  │     └─ ProgressBar.tsx
│  ├─ config
│  │  └─ site.ts
│  ├─ data
│  │  ├─ legal.ts
│  │  ├─ package-managers.ts
│  │  ├─ sample-cheatsheet.ts
│  │  ├─ sample-home.ts
│  │  ├─ sample-roadmaps.ts
│  │  ├─ sample-search.ts
│  │  └─ sample-tree.ts
│  ├─ lib
│  │  ├─ cheatsheet.ts
│  │  ├─ code-meta.ts
│  │  ├─ code.ts
│  │  ├─ content.ts
│  │  ├─ headings.ts
│  │  ├─ markdown.ts
│  │  ├─ package-commands.ts
│  │  ├─ progress-data.ts
│  │  ├─ progress-keys.ts
│  │  ├─ progress.ts
│  │  ├─ rehype-callouts.ts
│  │  ├─ remark-code-meta.ts
│  │  ├─ scroll.ts
│  │  ├─ search
│  │  │  ├─ actions.ts
│  │  │  ├─ highlight.ts
│  │  │  ├─ normalize.ts
│  │  │  ├─ search.ts
│  │  │  └─ types.ts
│  │  ├─ search-events.ts
│  │  ├─ section-landing.ts
│  │  ├─ shiki-theme.ts
│  │  ├─ shiki.ts
│  │  ├─ topic.ts
│  │  ├─ tree.ts
│  │  ├─ use-dialog.ts
│  │  └─ use-stored-string.ts
│  └─ styles
│     ├─ fonts.ts
│     ├─ layout.css
│     ├─ sidebar.css
│     ├─ syntax.css
│     ├─ theme-script.ts
│     └─ tokens.css
└─ tsconfig.json

```
```
knowledge-site
├─ AGENTS.md
├─ Anthropic
│  ├─ anthropic-mono
│  │  ├─ Anthropic Mono Web Regular Italic.otf
│  │  └─ Anthropic Mono Web.otf
│  ├─ anthropic-sans
│  │  ├─ AnthropicSans-Display-Bold-Static.otf
│  │  ├─ AnthropicSans-Display-BoldItalic-Static.otf
│  │  ├─ AnthropicSans-Display-Extrabold-Static.otf
│  │  ├─ AnthropicSans-Display-ExtraboldItalic-Static.otf
│  │  ├─ AnthropicSans-Display-Light-Static.otf
│  │  ├─ AnthropicSans-Display-Medium-Static.otf
│  │  ├─ AnthropicSans-Display-MediumItalic-Static.otf
│  │  ├─ AnthropicSans-Display-Regular-Static.otf
│  │  ├─ AnthropicSans-Display-RegularItalic-Static.otf
│  │  ├─ AnthropicSans-Display-Semibold-Static.otf
│  │  ├─ AnthropicSans-Text-Bold-Static.otf
│  │  ├─ AnthropicSans-Text-BoldItalic-Static.otf
│  │  ├─ AnthropicSans-Text-Extrabold-Static.otf
│  │  ├─ AnthropicSans-Text-ExtraboldItalic-Static.otf
│  │  ├─ AnthropicSans-Text-Light-Static.otf
│  │  ├─ AnthropicSans-Text-Medium-Static.otf
│  │  ├─ AnthropicSans-Text-MediumItalic-Static.otf
│  │  ├─ AnthropicSans-Text-Regular-Static.otf
│  │  ├─ AnthropicSans-Text-RegularItalic-Static.otf
│  │  └─ AnthropicSans-Text-Semibold-Static.otf
│  └─ anthropic-serif
│     ├─ AnthropicSerif-Display-Bold-Static.otf
│     ├─ AnthropicSerif-Display-BoldItalic-Static.otf
│     ├─ AnthropicSerif-Display-Extrabold-Static.otf
│     ├─ AnthropicSerif-Display-ExtraboldItalic-Static.otf
│     ├─ AnthropicSerif-Display-Light-Static.otf
│     ├─ AnthropicSerif-Display-LightItalic-Static.otf
│     ├─ AnthropicSerif-Display-Medium-Static.otf
│     ├─ AnthropicSerif-Display-MediumItalic-Static.otf
│     ├─ AnthropicSerif-Display-Regular-Static.otf
│     ├─ AnthropicSerif-Display-RegularItalic-Static.otf
│     ├─ AnthropicSerif-Display-Semibold-Static.otf
│     ├─ AnthropicSerif-Display-SemiboldItalic-Static.otf
│     ├─ AnthropicSerif-Text-Bold-Static.otf
│     ├─ AnthropicSerif-Text-BoldItalic-Static.otf
│     ├─ AnthropicSerif-Text-Extrabold-Static.otf
│     ├─ AnthropicSerif-Text-ExtraboldItalic-Static.otf
│     ├─ AnthropicSerif-Text-Light-Static.otf
│     ├─ AnthropicSerif-Text-LightItalic-Static.otf
│     ├─ AnthropicSerif-Text-Medium-Static.otf
│     ├─ AnthropicSerif-Text-MediumItalic-Static.otf
│     ├─ AnthropicSerif-Text-Regular-Static.otf
│     ├─ AnthropicSerif-Text-RegularItalic-Static.otf
│     ├─ AnthropicSerif-Text-Semibold-Static.otf
│     └─ AnthropicSerif-Text-SemiboldItalic-Static.otf
├─ BUILD_PLAN.md
├─ claude-design-files
│  ├─ Components-Light.dc.html
│  ├─ dashboard-light
│  │  ├─ Dash2FA-Light.dc.html
│  │  ├─ DashActivity-Light.dc.html
│  │  ├─ DashAppearance-Light.dc.html
│  │  ├─ DashArticles-Light.dc.html
│  │  ├─ DashBackups-Light.dc.html
│  │  ├─ DashCode-Light.dc.html
│  │  ├─ DashEditor-Light.dc.html
│  │  ├─ DashLegal-Light.dc.html
│  │  ├─ DashLogin-Light.dc.html
│  │  ├─ DashMedia-Light.dc.html
│  │  ├─ DashMobileLogin-Light.dc.html
│  │  ├─ DashNav-Light.dc.html
│  │  ├─ DashNodeEditor-Light.dc.html
│  │  ├─ DashOverview-Light.dc.html
│  │  ├─ DashPages-Light.dc.html
│  │  ├─ DashReset-Light.dc.html
│  │  ├─ DashRoadmaps-Light.dc.html
│  │  ├─ DashSearch-Light.dc.html
│  │  ├─ DashSecurity-Light.dc.html
│  │  ├─ DashSite-Light.dc.html
│  │  ├─ DashSocial-Light.dc.html
│  │  ├─ DashTabletEditor-Light.dc.html
│  │  ├─ DashTabletOverview-Light.dc.html
│  │  ├─ DashTabletPages-Light.dc.html
│  │  ├─ DashTrash-Light.dc.html
│  │  └─ DashUsers-Light.dc.html
│  ├─ Design-tokens.dc.html
│  ├─ desktop-light
│  │  ├─ Cheat-Light.dc.html
│  │  ├─ Error-Light.dc.html
│  │  ├─ Mixed-Light.dc.html
│  │  ├─ New folder
│  │  │  ├─ About-Light.dc.html
│  │  │  ├─ Article-Light.dc.html
│  │  │  ├─ Contact-Light.dc.html
│  │  │  ├─ Copyright-Light.dc.html
│  │  │  ├─ Home-Light.dc.html
│  │  │  ├─ Sidebar1-Light.dc.html
│  │  │  ├─ Sidebar2-Light.dc.html
│  │  │  ├─ Sidebar3-Light.dc.html
│  │  │  ├─ Sidebar4-Light.dc.html
│  │  │  ├─ Sidebar5-Light.dc.html
│  │  │  ├─ Sidebar6-Light.dc.html
│  │  │  ├─ Sidebar7-Light.dc.html
│  │  │  └─ Terms-Light.dc.html
│  │  ├─ NotFound-Light.dc.html
│  │  ├─ Privacy-Light.dc.html
│  │  ├─ Progress-Light.dc.html
│  │  ├─ Results-Light.dc.html
│  │  ├─ Roadmap-Light.dc.html
│  │  ├─ Roadmaps-Light.dc.html
│  │  ├─ Search-Light.dc.html
│  │  ├─ Section-Light.dc.html
│  │  └─ Topic-Light.dc.html
│  ├─ mobile-light
│  │  ├─ MobileArticle-Light.dc.html
│  │  ├─ MobileDrill-Light.dc.html
│  │  ├─ MobileHome-Light.dc.html
│  │  ├─ MobileProgress-Light.dc.html
│  │  ├─ MobileResults-Light.dc.html
│  │  ├─ MobileRoadmap-Light.dc.html
│  │  ├─ MobileRoadmaps-Light.dc.html
│  │  ├─ MobileSearch-Light.dc.html
│  │  ├─ MobileSection-Light.dc.html
│  │  └─ MobileTopic-Light.dc.html
│  └─ tablet-light
│     ├─ TabletArticle-Light.dc.html
│     ├─ TabletHome-Light.dc.html
│     ├─ TabletRoadmap-Light.dc.html
│     ├─ TabletSection-Light.dc.html
│     └─ TabletTopic-Light.dc.html
├─ content
│  └─ sample.md
├─ docs
│  └─ DEPLOYMENT.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ public
│  ├─ helmet.png
│  └─ sample-image.svg
├─ README.md
├─ scripts
│  └─ rename-icons.mjs
├─ src
│  ├─ app
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  ├─ api
│  │  │  ├─ backups
│  │  │  │  └─ export
│  │  │  │     └─ route.ts
│  │  │  ├─ health
│  │  │  │  └─ route.ts
│  │  │  ├─ keepalive
│  │  │  │  └─ route.ts
│  │  │  └─ media
│  │  │     ├─ delete
│  │  │     │  └─ route.ts
│  │  │     └─ upload-url
│  │  │        └─ route.ts
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ dashboard
│  │  │  ├─ actions.ts
│  │  │  ├─ dashboard.module.css
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [section]
│  │  │     └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.module.css
│  │  ├─ page.tsx
│  │  ├─ progress
│  │  │  └─ page.tsx
│  │  ├─ roadmaps
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ [[...node]]
│  │  │        └─ page.tsx
│  │  ├─ search
│  │  │  ├─ page.tsx
│  │  │  └─ search.module.css
│  │  ├─ terms
│  │  │  └─ page.tsx
│  │  └─ [section]
│  │     ├─ layout.tsx
│  │     └─ [[...slug]]
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ article
│  │  │  ├─ ArticleContent.module.css
│  │  │  ├─ ArticleFooter.tsx
│  │  │  ├─ ArticleHeader.tsx
│  │  │  ├─ ArticleShell.module.css
│  │  │  ├─ ArticleShell.tsx
│  │  │  ├─ OnThisPage.module.css
│  │  │  ├─ OnThisPage.tsx
│  │  │  ├─ ReadingProgressBar.tsx
│  │  │  ├─ RightSidebar.module.css
│  │  │  ├─ RightSidebar.tsx
│  │  │  ├─ ScrollButton.tsx
│  │  │  ├─ TocSheet.tsx
│  │  │  └─ use-article-scroll.ts
│  │  ├─ cheatsheet
│  │  │  ├─ CheatGroupCard.tsx
│  │  │  ├─ CheatSheet.module.css
│  │  │  ├─ CheatSheetPage.tsx
│  │  │  └─ PrintButton.tsx
│  │  ├─ home
│  │  │  ├─ HeroSearchHint.tsx
│  │  │  └─ Home.module.css
│  │  ├─ layout
│  │  │  ├─ CookieNotice.module.css
│  │  │  ├─ CookieNotice.tsx
│  │  │  ├─ Footer.module.css
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Navbar.module.css
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ NavLink.tsx
│  │  │  ├─ PageLayout.module.css
│  │  │  └─ PageLayout.tsx
│  │  ├─ locale
│  │  │  ├─ LanguageToggle.tsx
│  │  │  └─ LocaleProvider.tsx
│  │  ├─ markdown
│  │  │  ├─ Code.module.css
│  │  │  ├─ CodeBlock.tsx
│  │  │  ├─ CodeFrame.tsx
│  │  │  ├─ FileTree.tsx
│  │  │  ├─ markdown-components.tsx
│  │  │  ├─ Markdown.module.css
│  │  │  ├─ MarkdownRenderer.tsx
│  │  │  ├─ PackageTabs.tsx
│  │  │  ├─ PackageTabsFrame.tsx
│  │  │  ├─ ZoomImage.module.css
│  │  │  └─ ZoomImage.tsx
│  │  ├─ progress
│  │  │  ├─ ActivityHeatmap.tsx
│  │  │  ├─ CompactProgress.tsx
│  │  │  ├─ Progress.module.css
│  │  │  ├─ ProgressPage.tsx
│  │  │  ├─ ReadTracker.tsx
│  │  │  ├─ SectionCard.tsx
│  │  │  └─ SidebarProgress.tsx
│  │  ├─ roadmap
│  │  │  ├─ Legend.tsx
│  │  │  ├─ NodePanel.tsx
│  │  │  ├─ PanelFrame.tsx
│  │  │  ├─ Roadmap.module.css
│  │  │  ├─ RoadmapCard.tsx
│  │  │  ├─ RoadmapPanel.module.css
│  │  │  ├─ RoadmapProgress.tsx
│  │  │  ├─ Roadmaps.module.css
│  │  │  ├─ RoadmapsList.tsx
│  │  │  ├─ RoadmapTree.tsx
│  │  │  ├─ RoadmapView.tsx
│  │  │  └─ StepNode.tsx
│  │  ├─ search
│  │  │  ├─ Highlight.module.css
│  │  │  ├─ Highlight.tsx
│  │  │  ├─ PaletteDialog.tsx
│  │  │  ├─ Search.module.css
│  │  │  └─ SearchPalette.tsx
│  │  ├─ section
│  │  │  ├─ FollowMe.tsx
│  │  │  ├─ LandingCard.tsx
│  │  │  ├─ LandingList.tsx
│  │  │  ├─ SectionLanding.module.css
│  │  │  └─ SectionLanding.tsx
│  │  ├─ sidebar
│  │  │  ├─ Chevron.tsx
│  │  │  ├─ MobileDrawer.tsx
│  │  │  ├─ MobileNav.module.css
│  │  │  ├─ MobileSectionNav.tsx
│  │  │  ├─ NestedSidebar.module.css
│  │  │  ├─ NestedSidebar.tsx
│  │  │  ├─ SectionSidebar.tsx
│  │  │  ├─ SidebarColumn.tsx
│  │  │  ├─ SidebarColumns.tsx
│  │  │  ├─ SidebarRail.tsx
│  │  │  ├─ tree-utils.ts
│  │  │  └─ useFullColumnCount.ts
│  │  ├─ static
│  │  │  ├─ Contact.module.css
│  │  │  ├─ ContactForm.tsx
│  │  │  ├─ LegalPage.tsx
│  │  │  ├─ LegalToc.tsx
│  │  │  ├─ Static.module.css
│  │  │  ├─ StaticShell.tsx
│  │  │  └─ StatusPage.module.css
│  │  ├─ theme
│  │  │  ├─ ThemeProvider.tsx
│  │  │  └─ ThemeToggle.tsx
│  │  ├─ topic
│  │  │  ├─ TopicChildCard.tsx
│  │  │  ├─ TopicPage.module.css
│  │  │  └─ TopicPage.tsx
│  │  └─ ui
│  │     ├─ Icon.tsx
│  │     ├─ ProgressBar.module.css
│  │     └─ ProgressBar.tsx
│  ├─ config
│  │  └─ site.ts
│  ├─ data
│  │  ├─ legal.ts
│  │  ├─ package-managers.ts
│  │  ├─ sample-cheatsheet.ts
│  │  ├─ sample-home.ts
│  │  ├─ sample-roadmaps.ts
│  │  ├─ sample-search.ts
│  │  └─ sample-tree.ts
│  ├─ lib
│  │  ├─ auth.ts
│  │  ├─ backups.ts
│  │  ├─ cheatsheet.ts
│  │  ├─ code-meta.ts
│  │  ├─ code.ts
│  │  ├─ content.ts
│  │  ├─ headings.ts
│  │  ├─ markdown.ts
│  │  ├─ package-commands.ts
│  │  ├─ progress-data.ts
│  │  ├─ progress-keys.ts
│  │  ├─ progress.ts
│  │  ├─ r2.ts
│  │  ├─ rehype-callouts.ts
│  │  ├─ remark-code-meta.ts
│  │  ├─ scroll.ts
│  │  ├─ search
│  │  │  ├─ actions.ts
│  │  │  ├─ highlight.ts
│  │  │  ├─ normalize.ts
│  │  │  ├─ search.ts
│  │  │  └─ types.ts
│  │  ├─ search-events.ts
│  │  ├─ section-landing.ts
│  │  ├─ shiki-theme.ts
│  │  ├─ shiki.ts
│  │  ├─ supabase
│  │  │  ├─ admin.ts
│  │  │  ├─ client.ts
│  │  │  ├─ env.ts
│  │  │  └─ server.ts
│  │  ├─ topic.ts
│  │  ├─ tree.ts
│  │  ├─ use-dialog.ts
│  │  └─ use-stored-string.ts
│  ├─ proxy.ts
│  └─ styles
│     ├─ direction-script.ts
│     ├─ fonts.ts
│     ├─ layout.css
│     ├─ sidebar.css
│     ├─ syntax.css
│     ├─ theme-script.ts
│     └─ tokens.css
├─ supabase
│  └─ schema.sql
└─ tsconfig.json

```