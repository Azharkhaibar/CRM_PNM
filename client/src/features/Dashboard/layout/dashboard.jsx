import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const loc = useLocation();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    if (loc.state?.fromLogin) {
      setDialogMessage('✅ Login berhasil! Selamat datang di Dashboard 👋');
      setShowDialog(true);

      setTimeout(() => {
        setShowDialog(false); 
      }, 2500);
    }
  }, [loc.state]);

  return (
    <div className="p-6">
      <motion.h1 initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold mb-6">
        Dashboard
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
        <p className="text-blue-100 mt-1">Senang melihat Anda kembali. Semoga hari Anda produktif!</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-xl shadow-md p-6 border">
          <p className="text-gray-700 font-semibold">Total Risks</p>
          <h3 className="text-3xl font-bold text-blue-700 mt-2">125</h3>
          <p className="text-gray-500 text-sm mt-1">Semua risiko tercatat</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white rounded-xl shadow-md p-6 border">
          <p className="text-gray-700 font-semibold">Mitigated</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">58</h3>
          <p className="text-gray-500 text-sm mt-1">Sudah terselesaikan</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="bg-white rounded-xl shadow-md p-6 border">
          <p className="text-gray-700 font-semibold">In Progress</p>
          <h3 className="text-3xl font-bold text-yellow-600 mt-2">32</h3>
          <p className="text-gray-500 text-sm mt-1">Dalam proses</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-white rounded-xl shadow-md p-6 mt-6 border">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-3">
          <li className="p-3 border rounded-lg bg-gray-50">✅ Risk mitigation completed for <b>Operational Risk</b></li>
          <li className="p-3 border rounded-lg bg-gray-50">📌 New risk assessment added in <b>Market Risk</b></li>
          <li className="p-3 border rounded-lg bg-gray-50">🔄 Credit risk data updated for <b>Q4</b></li>
        </ul>
      </motion.div>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} 
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} 
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl p-6 rounded-xl text-center w-80"
            >
              <p className="text-lg font-semibold text-gray-800">Welcome</p>
              <p className="text-gray-600 mt-2">{dialogMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
