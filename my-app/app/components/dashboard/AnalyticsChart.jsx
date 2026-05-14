"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const analyticsData = [
  {
    month: "Jan",
    investors: 120,
    transactions: 540,
    networth: 12,
  },
  {
    month: "Feb",
    investors: 170,
    transactions: 620,
    networth: 18,
  },
  {
    month: "Mar",
    investors: 150,
    transactions: 580,
    networth: 15,
  },
  {
    month: "Apr",
    investors: 240,
    transactions: 760,
    networth: 24,
  },
  {
    month: "May",
    investors: 210,
    transactions: 690,
    networth: 20,
  },
  {
    month: "Jun",
    investors: 310,
    transactions: 860,
    networth: 32,
  },
  {
    month: "Jul",
    investors: 280,
    transactions: 810,
    networth: 28,
  },
  {
    month: "Aug",
    investors: 360,
    transactions: 940,
    networth: 40,
  },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Analytics Overview</h2>

        <p className="text-gray-500 mt-1">
          Track investor growth, transactions, and portfolio performance.
        </p>
      </div>

      <div className="w-full h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="investors"
              stroke="#2563eb"
              strokeWidth={3}
              name="Investors"
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#16a34a"
              strokeWidth={3}
              name="Transactions"
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="networth"
              stroke="#dc2626"
              strokeWidth={3}
              name="Net Worth"
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
