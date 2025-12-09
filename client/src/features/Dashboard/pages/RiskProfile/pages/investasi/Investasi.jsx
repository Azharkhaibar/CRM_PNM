import React, { useState } from 'react';
import KPMR from './kpmr_investasi-page';
import InvestasiPage from './investasi-page';
import { PNM_BRAND } from '../pasar/constant/constant';
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
      <div className={`relative rounded-2xl  mb-6 shadow-sm ${PNM_BRAND.gradient} `}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Risk Form – Investasi</h1>
          <p className="mt-1 text-white/90 text-sm">Form Investasi & KPMR dalam 1 halaman.</p>
        </div>
      </div>

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

      <div className="bg-white rounded-lg shadow-md p-4">
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
