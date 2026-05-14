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

export default function InvestorHoldingsPage({ params }) {
  const { investor_id } = params;
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError("Please login to access this page.");
      setLoading(false);
      return;
    }

    const fetchHoldings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/investors/${investor_id}/holdings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to fetch holdings.");
        }
        const data = await response.json();
        console.log("Holdings response:", data);
        setHoldings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load holdings.");
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [investor_id]);

  return (
    <div className="space-y-6">
      <Header title="Investor Holdings" subtitle="Review all assets and investments belonging to this investor." />
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">Loading holdings...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      ) : holdings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm">
          No holdings found for this investor.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Asset Name</th>
                <th className="px-6 py-4 text-sm font-semibold">Asset Type</th>
                <th className="px-6 py-4 text-sm font-semibold">Quantity</th>
                <th className="px-6 py-4 text-sm font-semibold">Purchase Price</th>
                <th className="px-6 py-4 text-sm font-semibold">Current Value</th>
                <th className="px-6 py-4 text-sm font-semibold">Profit / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
              {holdings.map((holding, idx) => (
                <tr key={holding?.id || holding?.asset_name || idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {holding?.asset_name || holding?.name || "Unknown Asset"}
                  </td>
                  <td className="px-6 py-4 text-sm">{holding?.asset_type || "—"}</td>
                  <td className="px-6 py-4 text-sm">{holding?.quantity ?? "—"}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(holding?.purchase_price)}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(holding?.current_value)}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${Number(holding?.profit_loss) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {formatCurrency(holding?.profit_loss)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
