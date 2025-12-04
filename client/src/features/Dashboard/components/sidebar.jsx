import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/pnm-pnmim.png';
import { FaChevronDown, FaChevronUp, FaUserCircle, FaSignOutAlt, FaBuilding, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-avatar';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';
import { ChevronsUpDown } from 'lucide-react';
import { Funnel, FunctionSquareIcon } from 'lucide-react';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [openRisk, setOpenRisk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode } = useDarkMode();
  const menuRef = useRef(null);
  const divisionRef = useRef(null);
  const [divisionDropdownOpen, setDivisionDropdownOpen] = useState(false);
  const nvg = useNavigate();

  const divisions = [
    {
      divisi_id: 1,
      name: 'Compliance',
      description: 'Divisi Compliance dan Manajemen Risiko',
      color: 'bg-blue-500',
    },
  ];

  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);

  const riskItems = ['investasi', 'pasar', 'likuiditas', 'operasional', 'hukum', 'stratejik', 'kepatuhan', 'reputasi'];

  useEffect(() => {
    if (pathname.startsWith('/dashboard/risk-form')) {
      setOpenRisk(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divisionRef.current && !divisionRef.current.contains(event.target)) {
        setDivisionDropdownOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path, exact = false) => (exact ? pathname === path : pathname.startsWith(path));

  const handleDivisionSelect = (division) => {
    setSelectedDivision(division);
    setDivisionDropdownOpen(false);
    console.log('Divisi dipilih:', division.name);
  };

  const sidebarClass = `w-64 h-screen border-r p-4 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`;

  const navItemClass = (active) =>
    `block py-3 gap px-4 rounded-lg text-[16px] font-medium transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 '
    }`;

  const riskButtonClass = (active) =>
    `w-full flex items-center justify-between py-2 px-4 rounded-lg text-[16px] font-medium transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 '
    }`;

  const riskSubItemClass = (active) =>
    `block py-2 px-4 rounded-lg text-[14px] font-normal transition-all duration-200 ml-2 ${
      active ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
    }`;

  const borderClass = darkMode ? 'border-gray-600' : 'border-gray-200';

  const userSectionClass = `mt-auto relative flex items-center gap-3 p-3 rounded-lg border transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`;

  const dropdownClass = `absolute bottom-full mb-2 left-0 w-64 border rounded-xl p-3 z-50 backdrop-blur-sm transition-colors duration-300 ${
    darkMode ? 'bg-gray-700/95 border-gray-600 text-white' : 'bg-white/95 border-gray-200 text-gray-800'
  }`;

  const dropdownItemClass = `flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-blue-50 hover:text-blue-700'}`;

  const dividerClass = `my-3 border-t transition-colors duration-300 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`;

  const divisionButtonClass = `w-full p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
    darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-200'
  }`;

  const divisionDropdownClass = `absolute top-full left-0 right-0 mt-2 border rounded-xl  p-3 z-50 backdrop-blur-sm transition-colors duration-300 ${
    darkMode ? 'bg-gray-700/95 border-gray-600 text-white' : 'bg-white/95 border-gray-200 text-gray-800'
  }`;

  const divisionOptionClass = `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 cursor-pointer group ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-blue-50 hover:text-blue-700'}`;

  const scrollbarClass = `
    /* Scrollbar untuk Webkit browsers (Chrome, Safari, Edge) */
    .sidebar-scrollbar::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      margin: 2px 0;
    }

    .sidebar-scrollbar::-webkit-scrollbar-thumb {
      background: ${darkMode ? 'rgba(156, 163, 175, 0.3)' : 'rgba(156, 163, 175, 0.3)'};
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${darkMode ? 'rgba(156, 163, 175, 0.5)' : 'rgba(156, 163, 175, 0.5)'};
    }

    .sidebar-scrollbar::-webkit-scrollbar-thumb:active {
      background: ${darkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(156, 163, 175, 0.7)'};
    }

    /* Scrollbar untuk Firefox */
    .sidebar-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: ${darkMode ? 'rgba(156, 163, 175, 0.3) transparent' : 'rgba(156, 163, 175, 0.3) transparent'};
    }

    /* Smooth scrolling */
    .sidebar-scrollbar {
      scroll-behavior: smooth;
    }
  `;

  return (
    <>
      <style>{scrollbarClass}</style>

      <div className={sidebarClass}>
        <div className="flex justify-center mb-8 mt-[25\px] flex-shrink-0">
          <img src={logo} alt="PNM" className="w-40 h-auto transition-all duration-300 hover:scale-105" />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative mb-6 flex-shrink-0" ref={divisionRef}>
            <div className={divisionButtonClass} onClick={() => setDivisionDropdownOpen(!divisionDropdownOpen)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedDivision.color} text-white `}>
                    <FaBuilding className="text-sm" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm">{selectedDivision.name}</span>
                    <span className="text-xs opacity-60">{user?.role || 'User'}</span>
                  </div>
                </div>
                <ChevronsUpDown size={16} className={`transition-transform duration-300 ${divisionDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>

            <AnimatePresence>
              {divisionDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className={divisionDropdownClass}>
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <h3 className="font-semibold text-sm mb-2">Pilih Divisi</h3>
                      <p className="text-xs opacity-60">Saat ini hanya tersedia divisi Compliance</p>
                    </div>

                    <div className="space-y-1">
                      {divisions.map((division) => (
                        <div
                          key={division.divisi_id}
                          className={`${divisionOptionClass} ${selectedDivision.divisi_id === division.divisi_id ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 border border-blue-200') : ''}`}
                          onClick={() => handleDivisionSelect(division)}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedDivision.divisi_id === division.divisi_id ? 'bg-white text-blue-600' : division.color}`}>
                            <FaBuilding className="text-xs" />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className="font-medium text-sm">{division.name}</span>
                            <span className="text-xs opacity-60">{division.description}</span>
                          </div>
                          {selectedDivision.divisi_id === division.divisi_id && <FaCheck className="text-blue-500 text-sm" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 overflow-y-auto sidebar-scrollbar">
            <nav className="space-y-2 pr-1">
              {' '}
              <div className="space-y-1">
                <Link to="/dashboard" className={navItemClass(isActive('/dashboard', true))}>
                  Dashboard
                </Link>

                <Link to="#" className={navItemClass(isActive('/dashboard/ras'))}>
                  Risk Appetite Statement
                </Link>
                <div className="space-y-1">
                  <button onClick={() => setOpenRisk(!openRisk)} className={`${riskButtonClass(isActive('/dashboard/risk-form'))} w-full flex justify-between`}>
                    <span className="flex gap-2 text-left">Profil Resiko Holdingkout </span>
                    {openRisk ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>

                  <AnimatePresence>
                    {openRisk && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="ml-4 mt-1 space-y-1 border-l-2 pl-3 py-1">
                          {riskItems.map((item) => {
                            const itemPath = `/dashboard/risk-form/${item}`;
                            const active = pathname === itemPath;
                            return (
                              <Link key={item} to={itemPath} className={riskSubItemClass(active)}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/dashboard/maturasi" className={navItemClass(isActive('/dashboard/maturasi', true))}>
                  Maturasi
                </Link>

                <Link to="/dashboard/report" className={navItemClass(isActive('/dashboard/report', true))}>
                  Laporan
                </Link>

                <div className={dividerClass} />

                <Link to="/dashboard/notification" className={navItemClass(isActive('/dashboard/notification', true))}>
                  Notification
                </Link>
                <Link to="/dashboard/audit-log" className={navItemClass(isActive('/dashboard/audit-log', true))}>
                  Audit Log
                </Link>
                <Link to="/dashboard/settings" className={navItemClass(isActive('/dashboard/settings', true))}>
                  Settings
                </Link>
              </div>
            </nav>
          </div>
        </div>

        <div className={userSectionClass} ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity">
            <Avatar src={user?.photoURL} name={user?.userID || 'User'} size="44" round color={darkMode ? '#60A5FA' : '#2563EB'} className="flex-shrink-0" />
            <div className="flex-1 flex flex-col items-start justify-center min-w-0">
              <div className={`font-semibold text-left truncate w-full text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user?.userID || 'Nama User'}</div>
              <div className={`text-xs text-left truncate w-full ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedDivision.name} • {user?.role || 'Role'}
              </div>
            </div>
            <ChevronsUpDown size={14} className={`flex-shrink-0 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className={dropdownClass}>
                <button
                  onClick={() => {
                    nvg('/dashboard/profile');
                    setMenuOpen(false);
                  }}
                  className={dropdownItemClass}
                >
                  <FaUserCircle className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Profile</span>
                    <span className="text-xs opacity-60">Kelola profil Anda</span>
                  </div>
                </button>

                <div className="my-2 border-t border-gray-200 dark:border-gray-600"></div>

                <button
                  onClick={() => {
                    logout();
                    nvg('/login');
                    setMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${darkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'}`}
                >
                  <FaSignOutAlt className="text-lg" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Logout</span>
                    <span className="text-xs opacity-60">Keluar dari sistem</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
