import React from 'react';
import CorporateRisk from './corporateRisk';
import ControlPerformance from './controlperformance';
import OpenIssues from './openissues';
import RiskByCategory from './riskbycategory';
import RiskMap from './riskmap';

const RiskManagementDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Risk Management KPI Dashboard Showing Open Issues...</h1>
          <div className="grid grid-cols-4 gap-6">
            <CorporateRisk />
            <ControlPerformance />
            <OpenIssues />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          <RiskByCategory />
          <RiskMap />
        </div>
      </div>
    </div>
  );
};

export default RiskManagementDashboard;
