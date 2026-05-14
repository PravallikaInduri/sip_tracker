"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import styles from "@/app/components/dashboard/Dashboard.module.css";
import { getAuthToken, getInvestorId } from "@/lib/auth";

export default function NetworthPage() {
  const [networth, setNetworth] = useState(0);
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

    const fetchNetworth = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/investors/${investorId}/networth`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to fetch net worth.");
        }
        const data = await response.json();
        setNetworth(data.networth ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworth();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Header title="Net Worth" subtitle="A summary of total portfolio value for the current investor." />
      {loading ? (
        <div className={styles.loadingMessage}>Calculating net worth...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <section className={styles.cardSection}>
          <h2>Investor Net Worth</h2>
          <p className={styles.cardDescription}>This amount is computed from price × quantity for all holdings.</p>
          <div className={styles.networthBox}>
            <span className={styles.networthValue}>₹{networth.toLocaleString()}</span>
          </div>
        </section>
      )}
    </div>
  );
}
