import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';
import { NotificationBell } from './notificationbell';
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
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold tracking-wide">RIMS</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-white/80'}`}>{pageTitle}</p>
          </div>

          {/* REKOMENDASI TAMBAHAN: */}
          {/* 1. Breadcrumb Navigation */}
          {/* 2. Quick Action Buttons */}
          {/* 3. Search Bar */}
          {/* 4. Company Logo */}
        </div>

        {/* Bagian Kanan - User Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          </button>

          {/* Notification Bell - Sudah Terintegrasi */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-700'}`}>
              <FaUserCircle className="text-2xl" />
              <div className="text-left">
                <span className="text-sm font-medium block">{user?.userID || 'Guest'}</span>
                {user?.email && <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-white/80'} block`}>{user.email}</span>}
              </div>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden z-50 ${darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-white text-gray-800 border border-gray-200'}`}
                  style={{ top: '100%' }}
                >
                  {/* User Info Section */}
                  <div className={`p-4 border-b ${darkMode ? 'border-gray-600 bg-gray-600/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-2xl text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user?.userID || 'Guest'}</p>
                        {user?.email && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>}
                        {user?.role && <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mt-1">{user.role}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/dashboard/profile');
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      <FaUserCircle className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm">Profile Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/dashboard/settings');
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      <FaCog className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm">Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/notifications');
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
                      </div>
                      <span className="text-sm">View All Notifications</span>
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />

                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${darkMode ? 'hover:bg-red-600/20 text-red-400 hover:text-red-300' : 'hover:bg-red-50 text-red-600 hover:text-red-700'}`}
                  >
                    <FaSignOutAlt />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
