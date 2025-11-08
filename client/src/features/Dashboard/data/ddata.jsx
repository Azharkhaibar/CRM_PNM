

export const riskData = {
  riskOverview: {
    credit: 35,
    operational: 25,
    market: 20,
    liquidity: 10,
    other: 10,
  },

  recentActivities: [
    { id: 1, type: 'credit', description: 'New credit risk assessment', date: '2025-10-15' },
    { id: 2, type: 'operational', description: 'Operational risk mitigation', date: '2025-10-12' },
    { id: 3, type: 'market', description: 'Market risk update', date: '2025-10-10' },
    { id: 4, type: 'credit', description: 'Credit risk review', date: '2025-10-08' },
  ],

  summaryStatistics: {
    totalRisks: 24,
    mitigated: 8,
    inProgress: 12,
    critical: 4,
  },
};

export const creditRiskData = {
  borrowers: [
    { id: 1, name: 'John Smith', creditScore: 750, loanAmount: 50000, interestRate: 3.5 },
    { id: 2, name: 'ABC Corporation', creditScore: 800, loanAmount: 1000000, interestRate: 4.2 },
    { id: 3, name: 'Jane Doe', creditScore: 680, loanAmount: 25000, interestRate: 5.1 },
  ],
};

export const operationalRiskData = {
  departments: ['Finance', 'HR', 'IT', 'Operations'],
  categories: ['Process Failure', 'People Risk', 'Systems Risk', 'External Risk'],
  probabilities: ['Low (0-30%)', 'Medium (31-70%)', 'High (71-100%)'],
  impacts: ['Low', 'Medium', 'High'],
};

export const marketRiskData = {
  assetClasses: ['Equity', 'Fixed Income', 'Commodities', 'Currency'],
  marketSegments: ['Domestic', 'International', 'Emerging Markets'],
  riskFactors: ['Interest Rate Risk', 'Equity Price Risk', 'Foreign Exchange Risk', 'Commodity Price Risk'],
};

export const reportData = {
  types: ['Risk Summary', 'Detailed Analysis', 'Compliance Report'],
  dateRanges: ['Last Week', 'Last Month', 'Last Quarter', 'Last Year'],
  recentReports: [
    { id: 1, name: 'Q3 Risk Summary', type: 'Summary', date: '2025-10-15', status: 'Completed' },
    { id: 2, name: 'Operational Risk Analysis', type: 'Detailed', date: '2025-10-10', status: 'Completed' },
    { id: 3, name: 'Compliance Report', type: 'Compliance', date: '2025-09-30', status: 'Completed' },
  ],
};
