import React, { useState } from 'react';
import KPMR from './kpmr_investasi-page';
import InvestasiPage from './investasi-page';
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
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Risk Form - Investasi</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('investasi')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'investasi' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Resiko Inheren
          </button>

          <button
            onClick={() => setActiveTab('kpmr')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kpmr' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Kualitas Penerapan Manajemen Resiko (KPMR)
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'investasi' && (
          <div>
            <InvestasiPage />
          </div>
        )}

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
