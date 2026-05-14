import Header from "@/app/components/Header";
import styles from "@/app/components/dashboard/Dashboard.module.css";

export default function FundsPage() {
  return (
    <div className={styles.dashboardContainer}>
      <Header title="Funds" subtitle="Track fund information and future integration points." />
      <section className={styles.cardSection}>
        <h2>Funds</h2>
        <p className={styles.cardDescription}>
          Fund management pages are ready for future backend integration. For now, this section is a placeholder for fund listings and NAV updates.
        </p>
        <div className={styles.loadingMessage}>No fund data is currently available in this demo.</div>
      </section>
    </div>
  );
}
