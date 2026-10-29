import { siteConfig } from "@/config/site"
import { Icon } from "@/components/ui/Icon"
import styles from "./SectionLanding.module.css"

export function FollowMe() {
    return (
        <div className={styles.follow}>
            Follow me
            {siteConfig.socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="icon-btn" aria-label={link.label}>
                    <Icon name={link.icon} />
                </a>
            ))}
        </div>
    )
}