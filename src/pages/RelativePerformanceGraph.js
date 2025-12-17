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

// const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ExportMarketCharts({ hsCodeGraphApiResponse, selectedHsCode,industryExportGraphApiResponse }) {
 // console.log("Received hsCodeGraphApiResponse:", hsCodeGraphApiResponse,selectedHsCode);
  const [data, setData] = useState({ hs: [], industry: [], market: [] });

  // Simulate live sample data updates every 5 seconds


  useEffect(() => {
    const generateData = () => ({
      hs: hsCodeGraphApiResponse.map((m) => ({ month: m.month_name, amount: m.value_usd})) || [],
      industry: industryExportGraphApiResponse.map((m) => ({ month: m.monthName, amount: m.monthValue})) || [],
      market: calculateMarketSharePercentage(hsCodeGraphApiResponse, industryExportGraphApiResponse),
    });

    setData(generateData());
    // const interval = setInterval(() => setData(generateData()), 5000);
    // return () => clearInterval(interval);

   // console.log("data after calculation:", data);
  }, [hsCodeGraphApiResponse, selectedHsCode, industryExportGraphApiResponse]);


  const calculateMarketSharePercentage = (hsData, industryData) => {
  const shareData = [];

  const industryMap = new Map();
  industryData.forEach(item => {
    industryMap.set(item.monthName, item.monthValue);
  });
  
 // console.log("Industry Map:", industryMap);
 // console.log("Industry Data:" , industryData);
  //console.log("HS Data:", hsData);

  hsData.forEach(hsItem => {
    const industryAmount = industryMap.get(hsItem.month_name) || 0;
   // console.log(`Calculating for hscode month: ${hsItem.month_name}, HS Amount: ${hsItem.value_usd}, Industry Amount: ${industryAmount}`);
    let sharePercentage = 0;
    if (industryAmount > 0 && hsItem.value_usd > 0) {
      sharePercentage = (hsItem.value_usd / industryAmount) * 100;
    }

    shareData.push({
      month: hsItem.month_name,
      amount: Number(sharePercentage.toFixed(2))
    });
  });

  // console.log("Calculated Market Share Data:", shareData);
  return shareData;
};


/*
const calculateMarketSharePercentage = (hsCodeGraphApiResponse, industryExportGraphApiResponse) => {
  const shareData = [];

  // Step 1: Create a map of industry month → amount for fast lookup
  const industryMap = new Map();
  industryExportGraphApiResponse.forEach(item => {
    industryMap.set(item.month, item.amount);
  });

  console.log("Industry Map:", industryMap);

  // Step 2: Loop through HS data & calculate percentage
  hsCodeGraphApiResponse.forEach(hsItem => {
    const industryAmount = industryMap.get(hsItem.month) || 0;

    let sharePercentage = 0;
    if (industryAmount > 0 && hsItem.amount > 0) {
      sharePercentage = (hsItem.amount / industryAmount) * 100;
    }

    shareData.push({
      month: hsItem.month,
      amount: Math.round(sharePercentage * 100) / 100
    });
  });

  console.log("Calculated Market Share Data:", shareData);
  return shareData;
};  */




  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Export & Market Dashboard 
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* HS Code Export Chart */}

     


<div className="bg-white rounded-2xl shadow-sm p-4">
  <h2 className="text-lg font-medium mb-2 text-indigo-600">HS Code Export</h2>
  {data?.hs?.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.hs} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        {/* <YAxis /> */}
        <YAxis
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
                domain={['dataMin - 5000000', 'dataMax + 5000000']}
              />
        <Tooltip formatter={(v) => (v ? v.toLocaleString() : '0')} />
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
  ) : (
    <p className="text-center col-span-3">No data available for the selected HS Code.</p>
  )}
</div>



        {/* Industry Export Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          
          <h2 className="text-lg font-medium mb-2 text-green-600">Industry Export</h2>

            {data?.industry?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.industry} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
                      <YAxis
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
                domain={['dataMin - 5000000', 'dataMax + 5000000']}
              />

               <Tooltip formatter={(value) => `${value.toLocaleString()} USD`} />
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
            ) : (
              <p className="text-center col-span-3">No data available for Industry Export.</p>
            )}
        </div>

        {/* Market Share Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-medium mb-2 text-amber-500">Relative Strength </h2>
          {data?.market?.length > 0 ? (
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
          ) : (
            <p className="text-center col-span-3">No data available for Market Share.</p>
          )}
        </div>
      </div>
    </div>
  );
}
