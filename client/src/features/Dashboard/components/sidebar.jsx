import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/pnm-pnmim.png';
import { FaChevronDown, FaChevronUp, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-avatar';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [openRisk, setOpenRisk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode } = useDarkMode(); 
  const menuRef = useRef(null);
  const nvg = useNavigate();

  const riskItems = ['investasi', 'pasar', 'likuiditas', 'operasional', 'hukum', 'stratejik', 'kepatuhan', 'reputasi'];

  useEffect(() => {
    if (pathname.startsWith('/dashboard/risk-form')) {
      setOpenRisk(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path, exact = false) => (exact ? pathname === path : pathname.startsWith(path));

  const sidebarClass = `w-64 h-screen border-r p-4 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`;

  const navItemClass = (active) =>
    `block py-2 px-4 rounded-lg text-[18px] font-medium transition ${active ? 'bg-blue-600 text-white shadow-sm' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-100 hover:text-gray-900'}`;

  const riskButtonClass = (active) =>
    `w-full flex items-center justify-between py-2 px-4 rounded-lg text-[18px] font-medium transition ${
      active ? 'bg-blue-600 text-white shadow-sm' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-100 hover:text-gray-900'
    }`;

  const riskSubItemClass = (active) =>
    `block py-1.5 px-3 rounded-md text-[16px] capitalize transition ${active ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'}`;

  const borderClass = darkMode ? 'border-gray-600' : 'border-gray-300';
  const userSectionClass = `mt-auto relative flex items-center gap-3 p-3 border-t transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`;

  const dropdownClass = `absolute bottom-full mb-2 left-0 w-52 border rounded-lg shadow-lg p-2 z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`;

  const dropdownItemClass = `flex items-center gap-2 w-full px-2 py-1 rounded text-sm transition ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`;

  return (
    <div className={sidebarClass}>
      <div className="flex justify-center mb-6">
        <img src={logo} alt="PNM" className="w-48 mt-6 object-contain transition-opacity duration-300" />
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <Link to="/dashboard" className={navItemClass(isActive('/dashboard', true))}>
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="#" className={navItemClass(isActive('/dashboard/ras'))}>
              RAS
            </Link>
          </li>

          <li>
            <button onClick={() => setOpenRisk(!openRisk)} className={riskButtonClass(isActive('/dashboard/risk-form'))}>
              <span className="flex items-center gap-2">Risk Profile</span>
              {openRisk ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {openRisk && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`ml-4 mt-2 space-y-1 border-l pl-3 overflow-hidden ${borderClass}`}
                >
                  {riskItems.map((item) => {
                    const itemPath = `/dashboard/risk-form/${item}`;
                    const active = pathname === itemPath;
                    return (
                      <li key={item}>
                        <Link to={itemPath} className={riskSubItemClass(active)}>
                          {item}
                        </Link>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li>
            <Link to="/dashboard/maturasi" className={navItemClass(isActive('/dashboard/maturasi', true))}>
              Maturasi
            </Link>
          </li>

          <li>
            <Link to="/dashboard/report" className={navItemClass(isActive('/dashboard/report', true))}>
              Report
            </Link>
          </li>

          <li>
            <Link to="/dashboard/settings" className={navItemClass(isActive('/dashboard/settings', true))}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className={userSectionClass} ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-start gap-3 w-full hover:opacity-80 transition-opacity">
          <Avatar src={user?.photoURL} name={user?.userID || 'User'} size="40" round color={darkMode ? '#60A5FA' : '#2563EB'} className="flex-shrink-0" />
          <div className="flex-1 flex flex-col items-start justify-center min-w-0">
            <div className={`font-medium text-left truncate w-full ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user?.userID || 'Nama User'}</div>
            <div className={`text-sm text-left truncate w-full ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.role || 'Divisi / Role'}</div>
          </div>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} className={dropdownClass}>
              <button
                onClick={() => {
                  nvg('/dashboard/profile');
                  setMenuOpen(false);
                }}
                className={dropdownItemClass}
              >
                <FaUserCircle className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  nvg('/login');
                  setMenuOpen(false);
                }}
                className={`${dropdownItemClass} ${darkMode ? 'text-red-400' : 'text-red-600'}`}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
