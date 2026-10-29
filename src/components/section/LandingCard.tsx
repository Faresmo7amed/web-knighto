import Link from "next/link"
import { Icon, type IconName } from '@/components/ui/Icon'
import styles from "./SectionLanding.module.css"

type Props = {
    title: string
    href: string
    description: string
    icon?: IconName
}

export function LandingCard({ title, href, description, icon }: Props) {
    return (
        <Link href={href} className={styles.card}>
            {icon ? <span className={styles.cardIcon}><Icon name={icon} /></span> : null}
            <span className={styles.cardTitle}>{title}</span>
            {description ? <span className={styles.cardText}>{description}</span> : null}
        </Link>
    )
}