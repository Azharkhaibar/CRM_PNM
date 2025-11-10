import React from 'react';

const OpenIssues = () => {
  const openIssues = [
    { name: 'Overdue', count: 8, color: 'bg-red-500' },
    { name: 'Impact-low', count: 23, color: 'bg-yellow-400' },
    { name: 'Impact-Medium', count: 15, color: 'bg-orange-500' },
    { name: 'Impact-High', count: 5, color: 'bg-red-600' },
  ];

  return (
    <div className="col-span-1 bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Open Issues</h2>
      <div className="space-y-3">
        {openIssues.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{item.name}</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm font-medium text-gray-800">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenIssues;
