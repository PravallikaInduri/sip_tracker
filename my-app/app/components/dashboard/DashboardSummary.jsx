import styles from "./Dashboard.module.css";

export default function DashboardSummary({ investorCount, holdingsCount, networth }) {
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.summaryCard}>
        <p className={styles.cardLabel}>Investors</p>
        <p className={styles.cardValue}>{investorCount ?? "-"}</p>
      </div>
      <div className={styles.summaryCard}>
        <p className={styles.cardLabel}>Holdings</p>
        <p className={styles.cardValue}>{holdingsCount ?? "-"}</p>
      </div>
      <div className={styles.summaryCard}>
        <p className={styles.cardLabel}>Net Worth</p>
        <p className={styles.cardValue}>₹{networth?.toLocaleString() ?? "-"}</p>
      </div>
    </div>
  );
}
