import React, { useState } from 'react';
import KPMR from './kpmr_investasi';
const Investasi = () => {
  const [activeTab, setActiveTab] = useState('investasi');

  const [formData, setFormData] = useState({
    borrowerName: '',
    creditScore: '',
    loanAmount: '',
    interestRate: '',
  });

  const [creditRiskData, setCreditRiskData] = useState([
    { id: 1, borrowerName: 'John Smith', creditScore: 750, loanAmount: 50000, interestRate: 3.5 },
    { id: 2, borrowerName: 'ABC Corporation', creditScore: 800, loanAmount: 1000000, interestRate: 4.2 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      id: creditRiskData.length + 1,
      ...formData,
      creditScore: parseInt(formData.creditScore) || 0,
      loanAmount: parseInt(formData.loanAmount) || 0,
      interestRate: parseFloat(formData.interestRate) || 0,
    };

    setCreditRiskData([...creditRiskData, newEntry]);
    setFormData({
      borrowerName: '',
      creditScore: '',
      loanAmount: '',
      interestRate: '',
    });
  };

  const filteredData = creditRiskData.filter((item) => item.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) || item.creditScore.toString().includes(searchTerm) || item.loanAmount.toString().includes(searchTerm));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Risk Form - Investasi</h1>

      {/* ==== TAB NAVIGATION ==== */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('investasi')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'investasi' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Investasi
          </button>

          <button
            onClick={() => setActiveTab('kpmr')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kpmr' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            KPMR Investasi
          </button>
        </nav>
      </div>

      {/* ==== TAB CONTENT ==== */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'investasi' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Credit Risk Assessment</h2>

            {/* FORM INPUT */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Name</label>
                <input type="text" name="borrowerName" value={formData.borrowerName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score</label>
                <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input type="number" name="interestRate" value={formData.interestRate} onChange={handleChange} step="0.01" className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Submit
              </button>
            </form>

            {/* SEARCH + TABLE */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1 text-lg">🔍 Search</label>
              <input type="text" className="w-60 p-2 border border-gray-300 rounded-md" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{item.borrowerName}</td>
                        <td className="px-6 py-4">{item.creditScore}</td>
                        <td className="px-6 py-4">${item.loanAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">{item.interestRate}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === GANTI BAGIAN INI === */}
        {activeTab === 'kpmr' && (
          <div>
            <KPMR />
          </div>
        )}
      </div>
    </div>
  );
};

export default Investasi;
