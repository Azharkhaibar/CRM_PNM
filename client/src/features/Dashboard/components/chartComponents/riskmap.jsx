import React from 'react';

const RiskMap = () => {
  const riskMap = [
    [6, 8, null, 1, null, null],
    [3, 24, null, null, null, null],
    [4, 13, 16, 7, 1],
    [1, 13, 1, 3, 2],
    [0, 3, 7, null, null],
  ];

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Risk Map</h2>
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-800">Risk Management KPI Dashboard</h3>
        </div>
      </div>

      <div className="flex">
        {/* Y-axis Label */}
        <div className="flex flex-col justify-between mr-4 py-8">
          <span className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">Likelihood</span>
        </div>

        {/* Risk Map Grid */}
        <div className="flex-1">
          {/* X-axis Labels */}
          <div className="flex justify-between mb-2 px-4">
            <span className="text-xs text-gray-600">2</span>
            <span className="text-xs text-gray-600">3</span>
            <span className="text-xs text-gray-600">Impact</span>
            <span className="text-xs text-gray-600">5</span>
            <span className="text-xs text-gray-600">6</span>
          </div>

          {/* Grid Cells */}
          <div className="space-y-1">
            {riskMap.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className={`flex-1 aspect-square border rounded flex items-center justify-center ${cell !== null ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium' : 'bg-gray-100 border-gray-200'}`}>
                    {cell !== null && <span className="text-sm">{cell}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 italic">This graph/chart is linked to excel, and changes automatically based on data. Just left click on it and select 'Edit Data'.</div>
    </div>
  );
};

export default RiskMap;
