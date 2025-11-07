import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../components/chart';
import { riskData } from '../data/ddata';
const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Mock data for different months
  const monthlyRiskData = {
    all: {
      riskOverview: [
        { name: 'Credit', value: 35 },
        { name: 'Operational', value: 25 },
        { name: 'Market', value: 20 },
        { name: 'Liquidity', value: 10 },
        { name: 'Other', value: 10 }
      ]
    },
    jan: {
      riskOverview: [
        { name: 'Credit', value: 40 },
        { name: 'Operational', value: 20 },
        { name: 'Market', value: 15 },
        { name: 'Liquidity', value: 15 },
        { name: 'Other', value: 10 }
      ]
    },
    feb: {
      riskOverview: [
        { name: 'Credit', value: 30 },
        { name: 'Operational', value: 30 },
        { name: 'Market', value: 25 },
        { name: 'Liquidity', value: 5 },
        { name: 'Other', value: 10 }
      ]
    },
    mar: {
      riskOverview: [
        { name: 'Credit', value: 35 },
        { name: 'Operational', value: 25 },
        { name: 'Market', value: 20 },
        { name: 'Liquidity', value: 10 },
        { name: 'Other', value: 10 }
      ]
    }
  };

  // Mock data for recent activities by month
  const monthlyActivitiesData = {
    all: [
      { id: 1, type: 'Credit', description: 'New credit risk assessment', date: '2025-10-15' },
      { id: 2, type: 'Operational', description: 'Operational risk mitigation', date: '2025-10-12' },
      { id: 3, type: 'Market', description: 'Market risk update', date: '2025-10-10' },
      { id: 4, type: 'Credit', description: 'Credit risk review', date: '2025-10-08' }
    ],
    jan: [
      { id: 1, type: 'Credit', description: 'January credit assessment', date: '2025-01-15' },
      { id: 2, type: 'Market', description: 'Market risk review', date: '2025-01-10' }
    ],
    feb: [
      { id: 1, type: 'Operational', description: 'February operational review', date: '2025-02-18' },
      { id: 2, type: 'Credit', description: 'Credit risk update', date: '2025-02-12' },
      { id: 3, type: 'Liquidity', description: 'Liquidity risk check', date: '2025-02-05' }
    ],
    mar: [
      { id: 1, type: 'Market', description: 'March market analysis', date: '2025-03-22' },
      { id: 2, type: 'Operational', description: 'Operational risk assessment', date: '2025-03-15' },
      { id: 3, type: 'Credit', description: 'Credit portfolio review', date: '2025-03-08' },
      { id: 4, type: 'Other', description: 'Miscellaneous risk check', date: '2025-03-01' }
    ]
  };

  // Get data based on selected month
  const riskOverviewData = monthlyRiskData[selectedMonth] ? monthlyRiskData[selectedMonth].riskOverview : monthlyRiskData.all.riskOverview;
  const recentActivitiesData = monthlyActivitiesData[selectedMonth] ? monthlyActivitiesData[selectedMonth] : monthlyActivitiesData.all;

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Handle month change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Risk Overview" className="h-96">
          <div className="w-full">
            <div className="mb-4">
              <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                className=" p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Months</option>
                <option value="jan">January</option>
                <option value="feb">February</option>
                <option value="mar">March</option>
              </select>
            </div>
            <div className="h-[254px] ml-[200px] mt-[-70px] w-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskOverviewData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Recent Activities" className="h-96">
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recentActivitiesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="id" fill="#8884d8" name="Activity ID" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-800">{riskData.summaryStatistics.totalRisks}</p>
            <p className="text-gray-600">Total Risks</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-800">{riskData.summaryStatistics.mitigated}</p>
            <p className="text-gray-600">Mitigated</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-800">{riskData.summaryStatistics.inProgress}</p>
            <p className="text-gray-600">In Progress</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-800">{riskData.summaryStatistics.critical}</p>
            <p className="text-gray-600">Critical</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;