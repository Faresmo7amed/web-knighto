import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Icon } from "@/components/ui/Icon"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import styles from "./Footer.module.css"

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <span>© {siteConfig.copyrightYear} {siteConfig.ownerName}</span>
                <nav aria-label="Legal" className={styles.links}>
                    {siteConfig.legalLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.link}>{link.label}</Link>
                    ))}
                </nav>
                <div className={styles.icons}>
                    {siteConfig.socialLinks.map((link) => (
                        <a key={link.label} href={link.href} className="icon-btn" aria-label={link.label}>
                            <Icon name={link.icon} />
                        </a>
                    ))}
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    )
}