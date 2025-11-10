import React from 'react';

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;