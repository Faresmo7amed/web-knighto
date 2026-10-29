import Link from "next/link"
import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { Icon } from "@/components/ui/Icon"
import { StaticShell } from "@/components/static/StaticShell"
import { ContactForm } from "@/components/static/ContactForm"
import page from "@/components/static/Static.module.css"
import styles from "@/components/static/Contact.module.css"

export const metadata: Metadata = { title: "Contact" }

export default function ContactRoute() {
    return (
        <StaticShell>
            <div className={styles.wrap}>
                <div className={styles.head}>
                    <nav aria-label="Breadcrumb" className={page.crumbs}>
                        <Link href="/">Home</Link>
                        <Icon name="chevron-right" />
                        <span className={page.crumbCurrent}>Contact</span>
                    </nav>
                    <h1 className={`${page.title} ${page.titleTight}`}>Contact</h1>
                    <p className={page.lead}>Questions, corrections or ideas for a new page. I read every message.</p>
                </div>
                <div className={styles.cols}>
                    <div className={styles.formCol}>
                        <ContactForm />
                    </div>
                    <aside className={styles.side}>
                        <div className={styles.box}>
                            <h2 className={styles.boxTitle}>Other ways to reach me</h2>
                            <a className={styles.contactRow} href={`mailto:${siteConfig.contactEmail}`}>
                                <span className={styles.contactIcon}><Icon name="mail" /></span>
                                {siteConfig.contactEmail}
                            </a>
                            {siteConfig.socialLinks.map((link) => (
                                <a key={link.label} className={styles.contactRow} href={link.href}>
                                    <span className={styles.contactIcon}><Icon name={link.icon} /></span>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </StaticShell>
    )
}