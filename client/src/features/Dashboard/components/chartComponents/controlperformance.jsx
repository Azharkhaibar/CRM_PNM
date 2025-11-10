import React from 'react';

const ControlPerformance = () => {
  const controlPerformance = [
    { name: 'Overdue', count: 12, color: 'bg-red-500' },
    { name: 'Open', count: 45, color: 'bg-orange-500' },
    { name: 'Effect Medium', count: 23, color: 'bg-yellow-500' },
    { name: 'Effect Low', count: 15, color: 'bg-blue-400' },
    { name: 'Effective', count: 89, color: 'bg-green-400' },
    { name: 'Effect-High', count: 34, color: 'bg-green-600' },
  ];

  return (
    <div className="col-span-1 bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Control Performance</h2>
      <div className="space-y-3">
        {controlPerformance.map((item, index) => (
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

export default ControlPerformance;
