import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ExportMarketCharts({ hsCodeGraphApiResponse, selectedHsCode }) {
  console.log("Received hsCodeGraphApiResponse:", hsCodeGraphApiResponse,selectedHsCode);
  const [data, setData] = useState({ hs: [], industry: [], market: [] });

  // Simulate live sample data updates every 5 seconds
  useEffect(() => {
    const generateData = () => ({
      hs: hsCodeGraphApiResponse.map((m) => ({ month: m.month_name, amount: m.value_usd})),
      industry: MONTHS.map((m) => ({ month: m, amount: Math.round(500 + Math.random() * 1500) })),
      market: MONTHS.map((m) => ({ month: m, amount: Math.round(10 + Math.random() * 90) })),
    });

    setData(generateData());
    // const interval = setInterval(() => setData(generateData()), 5000);
    // return () => clearInterval(interval);
  }, [hsCodeGraphApiResponse, selectedHsCode]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Export & Market Dashboard (Live Sample Data)
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* HS Code Export Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-medium mb-2 text-indigo-600">HS Code Export</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.hs} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                name="Amount (USD)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Export Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-medium mb-2 text-green-600">Industry Export</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.industry} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#16A34A"
                name="Amount (USD)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Share Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-medium mb-2 text-amber-500">Relative Strength </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.market} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#D97706"
                name="Share (%)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
