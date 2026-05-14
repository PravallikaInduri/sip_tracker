"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { getAuthToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const detailRows = [
  { label: "Investor ID", key: "investor_id" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone_no" },
  { label: "Aadhaar", key: "adhaar_no" },
  { label: "PAN", key: "pancard_no" },
  { label: "Passport", key: "passport_no" },
  { label: "Date of Birth", key: "dob" },
  { label: "Address", key: "address" },
  { label: "City", key: "city" },
  { label: "State", key: "state" },
  { label: "Pincode", key: "pincode" },
];

function formatValue(value, key) {
  if (value === undefined || value === null || value === "") return "—";
  if (key === "annual_income") {
    const number = Number(value);
    return Number.isFinite(number)
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number)
      : value;
  }
  return value;
}

export default function InvestorDetailsPage({ params }) {
  const { investor_id } = params;
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError("Please login to access this page.");
      setLoading(false);
      return;
    }

    const fetchInvestor = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/investors/${investor_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Investor not found.");
          }
          throw new Error("Unable to fetch investor details.");
        }
        const data = await response.json();
        console.log("Investor details response:", data);
        setInvestor(data);
      } catch (err) {
        setError(err.message || "Unable to load investor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [investor_id]);

  const fullName = [investor?.first_name, investor?.middle_name, investor?.last_name].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      <Header title={fullName || `Investor ${investor_id}`} subtitle="Review the full investor profile and contact details." />
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">Loading investor details...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      ) : !investor ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm">
          No investor data available.
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Investor profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{fullName || "Investor profile"}</h2>
                <p className="text-sm text-slate-500">ID: {investor?.investor_id || investor_id}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                <p className="text-base font-semibold">{investor?.email || "No email"}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.key} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{row.label}</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{formatValue(investor?.[row.key], row.key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
