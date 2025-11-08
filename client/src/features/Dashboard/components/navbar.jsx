import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = pathname.replace('/dashboard/', '').replaceAll('-', ' / ') || 'Dashboard';

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-3">
        <div>
          <h1 className="text-xl font-bold tracking-wide">Risk Management System</h1>
          <p className="text-sm text-white/80">{pageTitle}</p>
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-700 px-3 py-2 rounded-lg transition">
            <FaUserCircle className="text-2xl" />
            <span className="text-sm font-medium">{user?.userID || 'Guest'}</span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 5 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
                style={{ top: '100%' }} 
              >
                <button onClick={() => navigate('/dashboard/profile')} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <FaUserCircle /> Profile
                </button>
                <button onClick={() => navigate('/dashboard/settings')} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <FaCog /> Settings
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
