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

export default function ExportMarketCharts({ hsCodeGraphApiResponse, selectedHsCode,industryExportGraphApiResponse,searchParams }) {
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

console.log("searchParams data with HS Response:", searchParams);
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

const formatMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = String(d.getFullYear()).slice(-2);
  return `${month}'${year}`;
};




  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-2xl font-semibold text-center mb-6">
        Export & Market Dashboard 
      </h1> */}

<h3 className="text-2xl text-center mb-6" style={{fontWeight:'bold'}} >Relative Performance of HS Code {selectedHsCode ? selectedHsCode : null}  </h3>
    <div className="grid md:grid-cols-3 gap-6">
        {/* HS Code Export Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-medium mb-2 text-indigo-600 py-3">
          <span style={{fontWeight:'bold'}}> HS Code Export </span>  <span style={{color:'#0000FF',fontWeight:'normal',fontStyle:'normal',fontSize:'20px'}} >({formatMonthYear(searchParams.fromDate)} to {formatMonthYear(searchParams.toDate)})</span>
          </h2>
          {data?.hs?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.hs} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                
                {/* X-Axis with label */}
                <XAxis 
                  dataKey="month" 
                  // label={{ 
                  //   value: 'Months',
                  //   position: 'insideBottom',
                  //   offset: -10,
                  //   textAnchor: 'middle',
                  //   style: { fontSize: '15px', fill: '#4F46E5',fontWeight:'bold' }
                  // }}
                />
                
                {/* Y-Axis with label */}
                <YAxis
                width={80}
                  tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
                  domain={[0, 'dataMax + 5000000']}
                  label={{ 
                    value: 'Value in USD',
                    angle: -90,
                    dx: -45,
                    position: 'outsideLeft',
                   // textAnchor: 'middle',
                    style: { fontSize: '15px', fill: '#4F46E5',fontWeight:'bold' }
                  }}
                />



                
                <Tooltip formatter={(v) => (v ? v.toLocaleString() : '0')} />
                <Legend />
                
                {/* Line component following your style */}
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4F46E5"
                  name="Months"
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
          <h2 className="text-lg font-medium mb-2 text-green-600 py-3">
              <span style={{fontWeight:'bold'}}> Industry Export </span>  <span style={{color:'#0000FF',fontWeight:'normal',fontStyle:'normal',fontSize:'20px'}} >({formatMonthYear(searchParams.fromDate)} to {formatMonthYear(searchParams.toDate)})</span>
          </h2>
          {data?.industry?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.industry} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                
                {/* X-Axis with label */}
                <XAxis 
                  dataKey="month" 
                  // label={{ 
                  //   value: 'Months',
                  //   position: 'insideBottom',
                  //   offset: -10,
                  //   textAnchor: 'middle',
                  //   style: { fontSize: '12px', fill: '#16A34A',fontWeight:'bold' }
                  // }}
                />
                
                {/* Y-Axis with label */}
                <YAxis
                  width={80}
                  tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
                  domain={[0, 'dataMax + 5000000']}
                  label={{ 
                    value: 'Value in USD',
                    angle: -90,
                    dx: -45,
                    position: 'outsideLeft',
                   // textAnchor: 'middle',
                    style: { fontSize: '15px', fill: '#16A34A', fontWeight:'bold',marginRight:'10px' }
                  }}
                />



              
                
                <Tooltip formatter={(value) => `${value.toLocaleString()} USD`} />
                <Legend />
                
                {/* Line component following your style */}
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#16A34A"
                  name="Months"
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
          <h2 className="text-lg mb-2 py-3">
           
              
          <span style={{fontWeight:'bold'}}> Relative Strength (in %) </span>  <span style={{color:'#0000FF',fontWeight:'normal',fontStyle:'normal',fontSize:'20px'}} >({formatMonthYear(searchParams.fromDate)} to {formatMonthYear(searchParams.toDate)})</span>
          </h2>
          {data?.market?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.market} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                
                {/* X-Axis with label */}
                <XAxis 
                  dataKey="month" 
                  // label={{ 
                  //   value: 'Months',
                  //   position: 'insideBottom',
                  //   offset: -10,
                  //   textAnchor: 'middle',
                  //   style: { fontSize: '15px', fill: '#D97706' ,fontWeight:'bold'}
                  // }}
                />
                
                {/* Y-Axis with label */}
                <YAxis 
                 width={80}
                  label={{ 
                    value: 'Relation %',
                    angle: -90,
                     dx: -45,
                    position: 'outsideLeft',
                  //  textAnchor: 'middle',
                    style: { fontSize: '15px', fill: '#D97706',fontWeight:'bold',marginRight:'10px' }
                  }}
                />


                    

                
                
                <Tooltip formatter={(v) => `${v.toLocaleString()}%`} />
                <Legend />
                
                {/* Line component following your style */}
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#D97706"
                  name="Months"
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
