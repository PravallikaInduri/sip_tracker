"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { getAuthToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number) ? currencyFormatter.format(number) : value;
}

export default function InvestorNetworthPage({ params }) {
  const { investor_id } = params;
  const [networth, setNetworth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError("Please login to access this page.");
      setLoading(false);
      return;
    }

    const fetchNetworth = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/investors/${investor_id}/networth`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to fetch net worth.");
        }
        const data = await response.json();
        console.log("Net worth response:", data);
        setNetworth(data);
      } catch (err) {
        setError(err.message || "Unable to load net worth.");
      } finally {
        setLoading(false);
      }
    };

    fetchNetworth();
  }, [investor_id]);

  const totalNetWorth = networth?.total_net_worth ?? networth?.networth ?? 0;
  const totalInvestments = networth?.total_investments ?? networth?.totalInvestment ?? 0;
  const totalProfitLoss = networth?.total_profit_loss ?? networth?.profit_loss ?? 0;
  const breakdown = Array.isArray(networth?.asset_breakdown)
    ? networth.asset_breakdown
    : Array.isArray(networth?.breakdown)
    ? networth.breakdown
    : [];

  return (
    <div className="space-y-6">
      <Header title="Investor Net Worth" subtitle="View a snapshot of portfolio value and asset allocations." />
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">Loading net worth summary...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      ) : !networth ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm">
          No net worth data available for this investor.
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Net Worth</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(totalNetWorth)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Investments</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(totalInvestments)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profit / Loss</p>
              <p className={`mt-4 text-3xl font-semibold ${Number(totalProfitLoss) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(totalProfitLoss)}
              </p>
            </div>
          </div>

          {breakdown.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Asset Breakdown</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Allocation by asset type</p>
                </div>
              </div>
              <div className="space-y-3">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item?.asset_type || item?.name || `Asset ${idx + 1}`}</p>
                      <p className="text-xs text-slate-500">
                        {item?.quantity || item?.count || "—"} {item?.unit || "units"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(item?.value || item?.amount || 0)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
