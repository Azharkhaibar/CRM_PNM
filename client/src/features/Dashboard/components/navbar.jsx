import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-xl font-bold tracking-wide">Risk Management System</h1>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition">
            <FaUserCircle className="text-2xl" />
            <span className="text-sm font-medium">{user?.userID || 'Guest'}</span>
          </button>

          <button onClick={handleLogout} className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition">
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
