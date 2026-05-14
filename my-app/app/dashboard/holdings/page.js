"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import styles from "@/app/components/dashboard/Dashboard.module.css";
import { getAuthToken, getInvestorId } from "@/lib/auth";

export default function HoldingsPage() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    const investorId = getInvestorId();

    if (!token) {
      setError("Please login to access this page.");
      setLoading(false);
      return;
    }

    const fetchHoldings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/investors/${investorId}/holdings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to fetch holdings.");
        }
        const data = await response.json();
        setHoldings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Header title="Holdings" subtitle="See individual portfolio assets and current values." />
      {loading ? (
        <div className={styles.loadingMessage}>Loading holdings...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <section className={styles.cardSection}>
          <div className="mb-5">
            <h2>Holding Details</h2>
            <p className={styles.cardDescription}>Detailed holdings for the current investor account.</p>
          </div>
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
                {holdings.map((item, index) => (
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
      )}
    </div>
  );
}
