import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import styles from "./TopicPage.module.css"

type Props = { title: string; href: string; description: string }

export function TopicChildCard({ title, href, description }: Props) {
    return (
        <Link href={href} className={styles.card}>
            <span className={styles.cardText}>
                <span className={styles.cardTitle}>{title}</span>
                {description ? <span className={styles.cardDesc}>{description}</span> : null}
            </span>
            <span className={styles.cardArrow}><Icon name="chevron-right" /></span>
        </Link>
    )
}