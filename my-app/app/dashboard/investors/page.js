"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import InvestorsCard from "@/app/components/dashboard/InvestorsCard";
import styles from "@/app/components/dashboard/Dashboard.module.css";
import { getAuthToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function InvestorsPage() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setError("Please login to access this page.");
      setLoading(false);
      return;
    }

    const fetchInvestors = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/investors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to fetch investors.");
        }
        const data = await response.json();
        console.log("Investors response:", data);
        setInvestors(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message || "Unable to load investor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Header title="All Investors" subtitle="Browse the investor directory and view investor profiles." />
      {loading ? (
        <div className={styles.loadingMessage}>Loading investors...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <InvestorsCard investors={investors} />
      )}
    </div>
  );
}
