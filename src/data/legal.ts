import { siteConfig } from "@/config/site"

export type LegalSection = { id: string; title: string; paragraphs: string[] }
export type LegalDoc = { title: string; lead: string; sections: LegalSection[] }

const site = siteConfig.name
const owner = siteConfig.ownerName

// DRAFT text. Must be reviewed by the owner before launch.
export const legalDocs: Record<"terms" | "privacy" | "copyright", LegalDoc> = {
    terms: {
        title: "Terms and Conditions",
        lead: "The rules for using this site. Please read them before you continue.",
        sections: [
            { id: "s1", title: "Acceptance of terms", paragraphs: [`By using ${site}, you agree to these terms. If you do not agree, please do not use the site.`] },
            { id: "s2", title: "Use of the site", paragraphs: ["You may read, search and print the content for your own learning. Do not try to break the site, overload it with automated requests, or reach any area you were not given access to."] },
            { id: "s3", title: "Content and intellectual property", paragraphs: [`The articles, notes, roadmaps and designs on this site belong to ${owner} unless a page says otherwise. The Copyright Notice explains what you may reuse.`] },
            { id: "s4", title: "Links to other sites", paragraphs: [`Pages may link to other websites. They are not under the control of ${owner}, and their content and availability may change without notice.`] },
            { id: "s5", title: "Disclaimer", paragraphs: [`The content is shared for learning and reference. It is provided as it is, with no promise that it is complete, correct or up to date. Check official documentation before relying on it for important work. As far as the law allows, ${owner} is not responsible for loss that comes from using the site.`] },
            { id: "s6", title: "Changes to these terms", paragraphs: ["These terms may change from time to time. The date at the top of this page shows the latest update. Using the site after a change means you accept the new terms."] },
            { id: "s7", title: "Contact", paragraphs: ["Questions about these terms can be sent through the contact page."] },
        ],
    },
    privacy: {
        title: "Privacy Policy",
        lead: "What this site stores about you, and what it does not.",
        sections: [
            { id: "s1", title: "What this site collects", paragraphs: ["This site has no accounts and does not ask you to sign up. If you use the contact form, the name, email address and message you enter are used only to reply to you.", "Like any website, the hosting provider may log technical data such as your IP address and browser type when a page is requested."] },
            { id: "s2", title: "Reading progress", paragraphs: ["The pages you read and the roadmap steps you mark as done are saved in your browser's local storage, on your own device. They are not sent to a server. Clearing your browser data, or using the reset button on the Progress page, removes them."] },
            { id: "s3", title: "Cookies and local storage", paragraphs: ["The site uses no advertising or tracking cookies. It keeps a few small settings in your browser's local storage: your light or dark theme, the sidebar layout, your chosen package manager in code blocks, recent searches, and whether you dismissed the storage notice."] },
            { id: "s4", title: "Analytics", paragraphs: ["The site does not use analytics at the moment. If that changes, this section and the notice at the bottom of the page will be updated to say what is measured."] },
            { id: "s5", title: "Third-party services", paragraphs: ["The site is delivered by hosting, database and file storage providers, which receive the technical data needed to serve each page. Fonts are served from this site itself. Linked sites have their own privacy policies."] },
            { id: "s6", title: "Your choices", paragraphs: ["You can clear your saved progress and settings at any time from your browser settings, or reset progress from the Progress page. You can also use the contact page to ask about a message you sent."] },
            { id: "s7", title: "Changes to this policy", paragraphs: ["This policy may change. The date at the top of this page shows the latest update."] },
            { id: "s8", title: "Contact", paragraphs: ["Questions about privacy can be sent through the contact page."] },
        ],
    },
    copyright: {
        title: "Copyright Notice",
        lead: "Who owns what on this site, and how you may reuse it.",
        sections: [
            { id: "s1", title: "Ownership of content", paragraphs: [`Unless a page says otherwise, the articles, notes, cheat sheets, roadmaps and images on this site are © ${siteConfig.copyrightYear} ${owner}. All rights are reserved.`] },
            { id: "s2", title: "What you may do", paragraphs: ["You may read, print and share links to any page. You may quote short passages for discussion, teaching or review if you credit the site and link to the page you quoted."] },
            { id: "s3", title: "What you may not do", paragraphs: ["Please do not copy whole articles, republish them, sell them, or use them to build or train a product without written permission. Ask first through the contact page."] },
            { id: "s4", title: "Code samples", paragraphs: ["Code snippets are free to use in your own projects, including commercial ones, without credit. They come with no warranty. A snippet that states a different license follows that license."] },
            { id: "s5", title: "Third-party material", paragraphs: ["Some images, fonts or text may belong to others. Where that applies, the page credits the owner. The site's fonts are open-source fonts used under their own licenses."] },
            { id: "s6", title: "Reporting a problem", paragraphs: ["If you believe content on this site infringes your copyright, send the page address and what you believe is yours through the contact page, and it will be reviewed promptly."] },
        ],
    },
}