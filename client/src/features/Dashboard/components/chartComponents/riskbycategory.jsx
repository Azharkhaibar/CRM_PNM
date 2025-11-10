import React from 'react';
import { FaSquare, FaRegSquare } from 'react-icons/fa';

const RiskByCategory = () => {
  const riskCategories = ['Information Technology Legal', 'Physical Assets Code Of Contact', 'Macro - Market Dynamics Sales', 'Supply Chain People', 'Capital Structure', 'Accounting & Reporting'];

  return (
    <div className="col-span-1 bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk by Category</h2>
      <div className="space-y-2">
        {riskCategories.map((category, index) => (
          <div key={index} className="flex items-center gap-2 py-1">
            {index === 0 ? <FaSquare className="text-blue-500 text-xs" /> : <FaRegSquare className="text-gray-400 text-xs" />}
            <span className="text-sm text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Ranking</h3>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {[...Array(11)].map((_, i) => (
            <span key={i}>{i * 2}</span>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RiskByCategory;
