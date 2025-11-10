import React from 'react';
import { FaChevronUp } from 'react-icons/fa';

const CorporateRisk = () => {
  const corporateRisks = [
    { name: 'Regulation and Compliance', score: 'High', trend: 'up' },
    { name: 'Cost Cutting', score: 'High', trend: 'up' },
    { name: 'Impact Of Currency Volatility', score: 'High', trend: 'up' },
    { name: 'Missing Growth Opportunities', score: 'High', trend: 'up' },
    { name: 'Inappropriate Systems', score: 'High', trend: 'up' },
    { name: 'Organization Change', score: 'Medium', trend: 'up' },
    { name: 'Emerging Technologies', score: 'Medium', trend: 'up' },
    { name: 'Taxation Risk', score: 'Medium', trend: 'up' },
    { name: 'Shifting Demographics', score: 'Low', trend: 'up' },
    { name: 'Emerging Markets', score: 'Low', trend: 'up' },
  ];

  const getScoreColor = (score) => {
    switch (score) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Corporate Risk</h2>
      <div className="space-y-2">
        {corporateRisks.map((risk, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-gray-700">{risk.name}</span>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(risk.score)}`}>{risk.score}</span>
              <FaChevronUp className="text-green-500 text-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorporateRisk;
