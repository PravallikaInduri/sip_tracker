"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import DashboardSummary from "@/app/components/dashboard/DashboardSummary";
import AnalyticsChart from "@/app/components/dashboard/AnalyticsChart";
import HoldingsCard from "@/app/components/dashboard/HoldingsCard";
import NetworthCard from "@/app/components/dashboard/NetworthCard";
import styles from "@/app/components/dashboard/Dashboard.module.css";
import { getAuthToken, getInvestorId } from "@/lib/auth";

export default function DashboardPage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [investors, setInvestors] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [networth, setNetworth] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    const investorId = getInvestorId();

    if (!token) {
      setError("Please login to view the dashboard.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [investorRes, holdingsRes, networthRes, allRes, transactionsRes] = await Promise.all([
          fetch(`${API_BASE}/api/investors/${investorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/investors/${investorId}/holdings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/investors/${investorId}/networth`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/details`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!investorRes.ok) throw new Error("Failed to load investor profile.");
        if (!holdingsRes.ok) throw new Error("Failed to load holdings.");
        if (!networthRes.ok) throw new Error("Failed to load net worth.");
        if (!allRes.ok) throw new Error("Failed to load investor list.");
        if (!transactionsRes.ok) throw new Error("Failed to load recent transactions.");

        const investorData = await investorRes.json();
        const holdingsData = await holdingsRes.json();
        const networthData = await networthRes.json();
        const allInvestors = await allRes.json();
        const transactionsData = await transactionsRes.json();

        setName(investorData.name || "Investor");
        setHoldings(Array.isArray(holdingsData) ? holdingsData : []);
        setNetworth(networthData?.networth ?? 0);
        setInvestors(Array.isArray(allInvestors) ? allInvestors : [allInvestors]);
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      } catch (fetchError) {
        setError(fetchError.message || "Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Header title="Investor Dashboard" subtitle="Explore your portfolio, holdings, and investor details in one place." />
      {loading ? (
        <div className={styles.loadingMessage}>Loading dashboard data...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <>
          <DashboardSummary
            investorCount={investors.length}
            holdingsCount={holdings.length}
            networth={networth}
          />
          <AnalyticsChart />
          <section className={styles.cardSection}>
            <h2>Recent Transactions</h2>
            <p className={styles.cardDescription}>
              Latest transactions from the investment ledger are shown below.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Investor ID</th>
                    <th>SIP ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>NAV</th>
                    <th>Units</th>
                    <th>Date</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.txn_id}>
                      <td>{txn.txn_id}</td>
                      <td>{txn.investor_id}</td>
                      <td>{txn.sip_id}</td>
                      <td>{txn.txn_type}</td>
                      <td>₹{txn.txn_amount}</td>
                      <td>{txn.nav_value}</td>
                      <td>{txn.units_allocated}</td>
                      <td>{txn.txn_date}</td>
                      <td>{txn.payment_mode}</td>
                      <td>{txn.transaction_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <HoldingsCard holdings={holdings} />
          <NetworthCard networth={networth} />
        </>
      )}
    </div>
  );
}
