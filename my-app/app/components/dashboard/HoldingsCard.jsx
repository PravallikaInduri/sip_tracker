import styles from "./Dashboard.module.css";

export default function HoldingsCard({ holdings }) {
  return (
    <section className={styles.cardSection}>
      <h2>Holdings</h2>
      <p className={styles.cardDescription}>
        Review current investment holdings and the latest values.
      </p>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings?.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td>{item.name}</td>
                <td>₹{item.price.toLocaleString()}</td>
                <td>{item.quantity}</td>
                <td>₹{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
