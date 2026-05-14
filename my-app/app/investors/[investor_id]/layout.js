"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InvestorDetailLayout({ children, params }) {
  const { investor_id } = params;
  const pathname = usePathname();

  const tabs = [
    { label: "Overview", href: `/investors/${investor_id}` },
    { label: "Holdings", href: `/investors/${investor_id}/holdings` },
    { label: "Net Worth", href: `/investors/${investor_id}/networth` },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Investor details</p>
            <p className="text-lg font-semibold text-slate-900">{investor_id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
