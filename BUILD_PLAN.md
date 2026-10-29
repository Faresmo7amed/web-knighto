# BUILD_PLAN.md: Knowledge Site build plan

Claude: this file is your script. The user adds it to Project knowledge, together with the design brief (.md) and the exported design files. Follow it exactly.

---

## 0. How this works

- The user sends the word **continue** (sometimes with a step number). You do the NEXT single step from section 4, then stop.
- You cannot remember other chats. So:
  - In the same chat: "continue" = the step after the last one you finished.
  - In a new chat: the user will say something like `continue, last done: Step 5` and may paste a handoff summary. Start from the step after that. If the user says only "continue" in a new chat with no step number and no handoff, ask ONE question: "Which step did you last finish?" and show the step list (titles only).
- Never do more than one step per reply. Never skip ahead. Never redo a finished step unless asked.

## 1. Global rules (apply to every step)

- Stack: Next.js (App Router, TypeScript, src/ directory), npm for every command, ESLint on.
- Desktop design is the source of truth for the public site AND the dashboard. Match it exactly.
- Tablet and mobile designs are incomplete and may be wrong. Use them only as hints. Where missing or unclear, decide the best responsive behavior yourself from the desktop design, the same tokens and components, and section 13 of the brief. Do not ask about these decisions. List what you decided at the end of the step.
- Responsive means usable and clean, not pixel-perfect: no horizontal page scroll, touch targets at least 44px, tables scroll or stack, forms single-column.
- Do not redesign. Use CSS variables for all colors, fonts, spacing, radii. No hardcoded colors.
- Fonts (free stand-ins, defined in one file): DM Sans (interface), Source Serif 4 (reading), JetBrains Mono (code), IBM Plex Sans Arabic, Noto Naskh Arabic.
- Arabic pages use Western digits (2026).
- JS/TS style: no semicolons, 4-space indentation.
- Give code as paste-in snippets with the exact file path above each snippet. When files are created or moved, show the resulting folder structure as an ASCII tree.
- Every new function or method: one line on what it does and when to use it.
- In component examples, label which component is the parent and which is the child.
- Prefer simple solutions. Do not over-engineer.
- Keep explanations short. Explain "why" only when it is not obvious.
- Never put secrets in client code or in NEXT_PUBLIC_ variables.
- Any new SQL: give the file path, and exact steps to run it in the Supabase SQL Editor.
- Placeholders from the design (`[Site name]`, `[Owner name]`, `[Date]`) go in `src/config/site.ts`, never hardcoded in components.
- Legal text (Terms, Privacy, Copyright) must not ship as placeholders. When you reach those pages, say the text is a draft and must be reviewed by the owner.

## 2. Required ending of EVERY step

End every reply with these four blocks, in this order:

1. **Manual steps for you**: numbered, exact click paths and exact values to type, assuming the user has never used the tool. Say "None" if there are none.
2. **How to verify**: what to run, what URL to open, what the user should see.
3. **Decisions I made**: only if you made responsive or other choices not in the design. Skip if none.
4. A progress line in this exact format:

```text
PROGRESS: Step <N> done. Next: Step <N+1> (<title>). Say "continue".
```

## 3. Chat boundaries and effort

At the end of the LAST step of each chat group below, also output:

- A **handoff summary** (under 300 words): what is built, current folder tree, key decisions, env variable NAMES (never values), function names and file paths later steps depend on, and what is NOT done yet.
- Instructions: "Start a new chat in this Project, paste the handoff, then send: `continue, last done: Step <N>`."
- The suggested effort level for the next chat.

If a chat is getting very long before a group ends, suggest starting a new chat early with a handoff.

| Chat | Steps | Effort |
|---|---|---|
| 1 | 1, 2 | Medium |
| 2 | 3a, 3b, 3c | High |
| 3 | 4, 5, 6, 6b | Medium |
| 4 | 7, 8, 8b, 8c, 8d, 8e | Medium |
| 5 | 9, 9b, 9c, 10, 11 | Medium |
| 6 | 12a, 12b | High |
| 7 | 12c, 12d, 12e | Medium |
| 8 | 13, 14 | High |
| 9 | 15, 16 | High |
| 10 | 17, 18 | Medium |
| 11 | 19, 20 | Medium |
| 12 | 21a, 21b, 22, 23 | High |

Effort guide: Low for tiny edits, Medium for UI work, High for sidebar logic, schema, auth, editor, backups. Avoid Extra and Max.

## 4. The steps

### Chat 1: Setup and shell

**Step 1: Project setup and design tokens**
- Give the create-next-app command with npm (TypeScript, App Router, src/ directory, ESLint). Say where to run it, how to open the folder in VS Code, how to start it, and what the browser shows at http://localhost:3000.
- Create `src/styles/tokens.css` (color, type scale, spacing, radius, shadow tokens; light and dark; extracted from the design), `src/styles/syntax.css` (syntax tokens, light and dark), `src/app/globals.css`, `src/styles/fonts.ts` (next/font/google with fallback stacks including Arabic), `src/config/site.ts` (site name, owner name, social links as placeholders), and a no-flash light/dark theme provider with a toggle.

**Step 2: Layout shell and nav bar**
- Sticky nav bar: logo, section links, "More" menu, search button with Cmd/Ctrl+K hint, theme switch, social icons, mobile hamburger.
- Page layout with empty slots for left sidebars, center content, right sidebar. Include skip-to-content link.

### Chat 2: Nested sidebar

**Step 3a: Nested left sidebar columns**
- Use a hardcoded 4-level tree in `src/data/sample-tree.ts`.
- Up to 4 columns, chevrons for items with children, icons only in column 1, independent scroll, truncation with tooltip, active-path highlight across columns, states: default, hover, active, expanded, focus. Center content narrows gracefully. Medium screens: older columns collapse to a thin rail.

**Step 3b: Collapse, hover-reveal, pin**
- Collapsed state, hover on the edge slides the sidebar in as an overlay, pin button keeps it open. Remember the state in localStorage.

**Step 3c: Tablet drawer and mobile drill-down**
- Tablet: left sidebar as a drawer. Mobile: stacked drill-down, one level at a time with a back button, 4 levels.

### Chat 3: Article, markdown, code

**Step 4: Right sidebar and article page**
- "On this page" with scroll-spy, reading progress with time left, back to top, copy link, closed and hover-reveal states. Tablet bottom sheet, mobile floating button.
- Article page: breadcrumb, title, subtitle, meta row, body, previous/next buttons, floating scroll button, thin progress bar under the nav. Use `content/sample.md`.

**Step 5: Markdown renderer**
- Recommend MDX vs react-markdown in 2 lines, then implement. Style every element from the design: heading anchors, quotes, callouts (Note, Tip, Warning, Danger, Info), tables with scroll, images with caption and zoom, footnotes, details/summary, kbd, task lists, file tree blocks, inline code.

**Step 6: Code blocks**
- Shiki. Header with language label, file name, copy button with "Copied" feedback. Line numbers, line highlight, diff lines, collapse long blocks, terminal variant with non-selectable prompt. Map `syntax.css` tokens to Shiki light and dark themes. Code always LTR.

**Step 6b: Package manager tabs**
- npm, pnpm, yarn, bun tabs. Install/run commands convert automatically. Remember the choice in localStorage across the site. The list of managers lives in one data file so more can be added later.

### Chat 4: Search and public pages

**Step 7: Search**
- Cmd/Ctrl+K command palette: groups Pages, Topics, Headings, Content matches; snippets with highlighted match and breadcrumb; recent searches; empty, loading, no-results states; keyboard navigation; Arabic and mixed text. Mock data behind `searchContent(query)` so the backend can replace it later. Also the full search results page.

**Step 8: Home page.** Hero, section cards grid, latest articles, featured roadmaps, progress summary, social links. Mock data.

**Step 8b: Section landing page.**

**Step 8c: Topic main page.** Banner with gradient fallback, overlapping icon, description, tags, meta, "Start reading", child page cards. Only this page type has banner and icon.

**Step 8d: Cheat sheet layout.** Multi-column cards and tables, print-friendly.

**Step 8e: Static pages and extras.** About, Terms, Privacy, Copyright, Contact (form), 404, error page, cookie notice, footer.

### Chat 5: Roadmaps, progress, RTL

**Step 9: Roadmaps list page.** Cards with icon, title, description, topic count, progress; category tabs.

**Step 9b: Roadmap page.** Vertical tree with central spine, left/right branches, section labels, node types (main, sub, optional, alternative, recommended), node states (default, hover, selected, completed, locked/optional), legend, overall progress bar. Sample data in `src/data/sample-roadmap.ts`.

**Step 9c: Node details panel.** Right panel (bottom sheet on mobile): title, description, markdown study content, resource links with type icons, related pages, "Mark as done", previous/next node, close button, Esc, deep-linkable URL per node.

**Step 10: Progress tracking and page.** localStorage for read pages and completed roadmap nodes. Heatmap grid by section, legend, tooltips, per-section percentage, compact version for the sidebar footer and home.

**Step 11: RTL/LTR.** Whole-page direction (mirrored sidebars, chevrons, breadcrumbs, progress, scroll buttons), per-block direction inside articles, inline mixing without punctuation jumping, code always LTR, language switcher shown only with more than one language. Sample English, Arabic and mixed pages.

### Chat 6: Supabase and schema

**Step 12a: Supabase setup (no schema yet)**
- Full manual walkthrough: create account and project (region, what to put in each field, where to store the database password); where to find Project URL, publishable (anon) key, and secret (service role) key, and which are browser-safe; create `.env.local` in the project root and a committable `.env.example` with exact variable names; confirm `.env.local` is in `.gitignore`.
- `npm install @supabase/supabase-js @supabase/ssr`
- Create `src/lib/supabase/client.ts`, `server.ts`, `admin.ts` (server-only, throws if imported in client code), and `src/app/api/health/route.ts`.

**Step 12b: Database schema**
- From the brief, design tables: pages (4-level tree with parent_id, sort order, icon, visibility), articles/content, topic page fields (banner, icon), tags, roadmaps, roadmap nodes, node resources, media, nav links, social links, site settings, theme tokens, syntax colors, package managers, legal pages, article versions, soft delete via `deleted_at`.
- One file `supabase/schema.sql`, ordered to run without errors. Indexes, including full-text search (note Arabic support). RLS: visitors read published and non-deleted rows only, only the owner writes. Enforce the 4-level depth limit. ASCII relation diagram. Exact steps to run it in the SQL Editor and check the tables exist. No app code in this step.

### Chat 7: Data, images, keep-alive

**Step 12c: Data layer**
- Replace mock data with Supabase queries in `src/lib/db/` (one file per entity), keeping the same function names and return shapes so the UI does not change. Implement `searchContent` with Postgres full-text search (titles, headings, content snippets with highlights). Seed script with sample rows and manual steps to run it.

**Step 12d: Cloudflare R2 images**
- Manual walkthrough: Cloudflare account, enable R2 (say whether a payment method is required and tell the user to verify the free allowance on the pricing page), create a bucket, public access the safe way, where to find the public URL, API token with minimal permissions, where to copy Account ID / Access Key ID / Secret Access Key, CORS JSON for browser uploads, env variables in `.env.local` and `.env.example`.
- `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
- `src/lib/r2.ts` (server-only), owner-only `src/app/api/media/upload-url/route.ts` and `delete/route.ts`, media table insert with alt text and size, `next.config.ts` image domain. ASCII diagram of the upload flow.

**Step 12e: Keep Supabase awake**
- `src/app/api/keepalive/route.ts` running one tiny query, protected by a secret header. GitHub Actions workflow `.github/workflows/keepalive.yml` every 3 days. Manual steps: add GitHub secrets, run once to test, confirm it works.

### Chat 8: Auth and dashboard shell

**Step 13: Dashboard authentication**
- Supabase Auth: login (email + password), TOTP 2FA step, forgot/reset password, middleware protection for `/dashboard`, sessions list with sign-out, security settings, lockout and session-expired states. Only the owner account may access the dashboard, enforced on the server and in RLS, not only in the UI.
- Manual steps: create the owner user, disable public sign-ups, email and redirect URLs, enable MFA, how to test every flow.

**Step 14: Dashboard layout and Overview**
- Left rail, top bar with search, user menu, theme toggle, "View site" button, breadcrumbs, page actions, unsaved-changes indicator. Overview screen with real counts, recent edits, drafts, quick actions.

### Chat 9: Tree and editor

For every dashboard step (14 to 21): use the existing data layer and R2 routes, and list any new tables, columns or policies as SQL with exact manual steps to run it. Every list screen needs search/filter/sort, bulk actions, empty state, skeleton, error state, delete confirmation. Every form needs validation states and a success toast.

**Step 15: Pages tree editor.** Drag and drop, add, rename, move, reorder, delete, change icon for top level, visibility, 4-level limit shown clearly.

**Step 16: Article editor.** Markdown editor with live preview (split or toggle), toolbar, slash menu, image drag/drop/paste via R2, code block options (language, file name, line highlight, package manager tabs toggle), per-block direction toggle, metadata panel (title, slug, description, tags, section, parent, order, banner and icon for topic pages only, status, SEO, reading time), long-document outline panel that stays fast.

### Chat 10: Versions and media

**Step 17: Autosave, versions, publishing, trash.** Autosave, version history with restore, preview as visitor, draft/scheduled/published, trash with restore.

**Step 18: Media library.** Grid, upload to R2, search, alt text, delete, usage info.

### Chat 11: Roadmaps manager and settings

**Step 19: Roadmaps manager.** List, create, visual node editor (add, remove, reorder, nest), node editor with markdown study content, resources list, node type and state.

**Step 20: Settings screens.** Appearance (theme tokens and syntax color editor with live preview, light and dark), navigation and layout, code block settings (package managers), search settings (reindex, excluded pages), social links, site settings, legal page editors (About, Terms, Privacy, Copyright, Contact), users and access placeholder.

### Chat 12: Backups, deploy, final pass

**Step 21a: Backup screen (app level).** Export all content as JSON and as a zip of Markdown files with frontmatter. Import with validation and a dry-run preview, never overwriting without confirmation. Server-side and owner-only.

**Step 21b: Automatic full database backup.** GitHub Actions workflow running `pg_dump` weekly, saved as an artifact or in a private repo (encrypted if possible). Manual steps: find the database connection string, add it as a GitHub secret, run the workflow once to test, restore a dump into a fresh Supabase project. Also explain how to back up R2 images (rclone or manual download). Remind the user to download a dashboard export monthly and keep it outside the cloud.

**Step 22: Deploy to Vercel (free plan).** Git commands to push to GitHub, import into Vercel, add every env variable (mark which are secret), Supabase auth redirect URLs for the Vercel domain, verify production.

**Step 23: Accessibility and performance pass.** Keyboard navigation, visible focus rings, skip link, reduced motion, print stylesheet, lazy loading. List anything still missing compared to the brief.

When Step 23 is done, say the project is complete and list the remaining optional items (Arabic-Indic digits, real images, reviewed legal text).

## 5. If the user reports a problem

When the user sends an error or a visual difference ("table clips at 375px", "padding is 16px, design has 24px"), fix only that with the smallest change, then repeat the progress line for the step they were on. Do not advance to the next step until they say "continue".
