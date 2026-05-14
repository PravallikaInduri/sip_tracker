import styles from "./Dashboard.module.css";

export default function NetworthCard({ networth }) {
  return (
    <section className={styles.cardSection}>
      <h2>Net Worth</h2>
      <p className={styles.cardDescription}>
        Net worth is calculated from the portfolio value of each holding.
      </p>
      <div className={styles.networthBox}>
        <span className={styles.networthValue}>₹{networth?.toLocaleString() ?? 0}</span>
      </div>
    </section>
  );
}
