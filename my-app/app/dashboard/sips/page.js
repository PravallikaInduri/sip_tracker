import Header from "@/app/components/Header";
import styles from "@/app/components/dashboard/Dashboard.module.css";

export default function SipsPage() {
  return (
    <div className={styles.dashboardContainer}>
      <Header title="SIPs" subtitle="Summary of systematic investment plans and future portfolio growth." />
      <section className={styles.cardSection}>
        <h2>Systematic Investment Plans</h2>
        <p className={styles.cardDescription}>
          This dashboard area is reserved for SIP-related analytics. Once SIP APIs are added, this page can show installment status, upcoming dates, and transaction history.
        </p>
        <div className={styles.loadingMessage}>No SIP records exist in the current sample data.</div>
      </section>
    </div>
  );
}
