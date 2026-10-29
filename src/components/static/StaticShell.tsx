import { Footer } from "@/components/layout/Footer"
import styles from "./Static.module.css"

export function StaticShell({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.shell}>
            <main id="main-content" className={styles.main}>{children}</main>
            <Footer />
        </div>
    )
}