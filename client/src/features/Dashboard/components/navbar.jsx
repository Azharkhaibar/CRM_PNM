import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();

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
    <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'} shadow-md sticky top-0 z-50 transition-colors duration-300`}>
      <div className="flex justify-between items-center px-6 py-3">
        <div>
          <h1 className="text-xl font-bold tracking-wide">Risk Management System</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-white/80'}`}>{pageTitle}</p>
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-700'}`}>
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
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                style={{ top: '100%' }}
              >
                <button
                  onClick={() => {
                    navigate('/dashboard/profile');
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 transition ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                >
                  <FaUserCircle />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/settings');
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 transition ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                >
                  <FaCog />
                  <span>Settings</span>
                </button>

                <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>

                <button onClick={handleLogout} className={`w-full text-left px-4 py-3 flex items-center gap-2 transition ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}>
                  <FaSignOutAlt />
                  <span>Logout</span>
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
