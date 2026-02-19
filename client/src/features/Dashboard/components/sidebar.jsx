import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/pnm-pnmim.png';
import {
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaSignOutAlt,
  FaBuilding,
  FaCheck,
  FaChartLine,
  FaMoneyBillWave,
  FaBalanceScale,
  FaCoins,
  FaShieldAlt,
  FaGavel,
  FaClipboardCheck,
  FaStar,
  FaLightbulb,
  FaHandshake,
  FaChartPie,
  FaCogs,
  FaHome,
  FaBook,
  FaBell,
  FaFileAlt,
  FaSlidersH,
  FaHistory,
  FaExchangeAlt,
  FaProjectDiagram,
  FaChartBar,
  FaBuilding as FaBuildingIcon,
  FaPercentage,
  FaCashRegister,
  FaUserShield,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-avatar';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';
import { ChevronsUpDown } from 'lucide-react';

const Sidebar = ({ onWidthChange }) => {
  const { pathname } = useLocation();
  const [openRisk, setOpenRisk] = useState(false);
  const [openOjkRisk, setOpenOjkRisk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode } = useDarkMode();
  const menuRef = useRef(null);
  const divisionRef = useRef(null);
  const ojkRiskRef = useRef(null);
  const [divisionDropdownOpen, setDivisionDropdownOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const minWidth = 80;
  const maxWidth = 400;
  const collapsedThreshold = 180;

  const divisions = [
    {
      divisi_id: 1,
      name: 'Risk Management',
      description: 'Divisi Compliance dan Manajemen Risiko',
      color: 'bg-blue-500',
    },
  ];

  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);

  // Risk items untuk Holding (terpisah dari OJK)
  const riskItems = [
    { name: 'Investasi', path: '/dashboard/risk-form/investasi' },
    { name: 'Pasar', path: '/dashboard/risk-form/pasar' },
    { name: 'Likuiditas', path: '/dashboard/risk-form/likuiditas' },
    { name: 'Operasional', path: '/dashboard/risk-form/operasional' },
    { name: 'Hukum', path: '/dashboard/risk-form/hukum' },
    { name: 'Stratejik', path: '/dashboard/risk-form/stratejik' },
    { name: 'Kepatuhan', path: '/dashboard/risk-form/kepatuhan' },
    { name: 'Reputasi', path: '/dashboard/risk-form/reputasi' },
  ];

  // Menu OJK dalam satu list dengan urutan yang diminta
  const ojkRiskItems = [
    { name: 'Pasar Produk', path: '/dashboard/ojk/pasar-produk' },
    { name: 'Likuiditas Produk', path: '/dashboard/ojk/likuiditas-produk' },
    { name: 'Kredit Produk', path: '/dashboard/ojk/kredit-produk' },
    { name: 'Konsentrasi Produk', path: '/dashboard/ojk/konsentrasi-produk' },
    { name: 'Operasional', path: '/dashboard/ojk/operasional' },
    { name: 'Hukum', path: '/dashboard/ojk/hukum' },
    { name: 'Kepatuhan', path: '/dashboard/ojk/kepatuhan' },
    { name: 'Reputasi', path: '/dashboard/ojk/reputasi' },
    { name: 'Strategis', path: '/dashboard/ojk/strategis' },
    { name: 'Investasi', path: '/dashboard/ojk/investasi' },
    { name: 'Rentabilitas', path: '/dashboard/ojk/rentabilitas' },
    { name: 'Permodalan', path: '/dashboard/ojk/permodalan' },
    { name: 'Tata Kelola', path: '/dashboard/ojk/tata-kelola' },
  ];

  // Auto open dropdown jika path active
  useEffect(() => {
    if (pathname.startsWith('/dashboard/risk-form')) {
      setOpenRisk(true);
    }
    if (pathname.startsWith('/dashboard/ojk')) {
      setOpenOjkRisk(true);
    }
  }, [pathname]);

  // Handle resize sidebar dengan throttling
  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;

      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
      setSidebarWidth(newWidth);
      setIsCollapsed(newWidth <= collapsedThreshold);

      // Kirim perubahan width ke parent
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    },
    [isResizing, onWidthChange],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = 'auto';
  }, []);

  // Handle resize sidebar
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Handle click outside untuk semua dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divisionRef.current && !divisionRef.current.contains(event.target)) {
        setDivisionDropdownOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (ojkRiskRef.current && !ojkRiskRef.current.contains(event.target)) {
        setOpenOjkRisk(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fungsi untuk menentukan active state
  const isActive = (path, exact = false) => (exact ? pathname === path : pathname.startsWith(path));

  // Handle division selection
  const handleDivisionSelect = (division) => {
    setSelectedDivision(division);
    setDivisionDropdownOpen(false);
  };

  // Handle toggle collapse
  const handleToggleCollapse = () => {
    const newWidth = isCollapsed ? 280 : minWidth;
    setSidebarWidth(newWidth);
    setIsCollapsed(!isCollapsed);

    // Kirim perubahan width ke parent
    if (onWidthChange) {
      onWidthChange(newWidth);
    }
  };

  // CSS Classes dengan dark mode support
  const sidebarClass = `h-screen border-r flex flex-col transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`;

  const navItemClass = (active) =>
    `flex items-center gap-3 py-3 px-3 rounded-lg text-[15px] font-medium transition-all duration-200 truncate ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
    }`;

  const riskButtonClass = (active) =>
    `w-full flex items-center justify-between py-3 px-3 rounded-lg text-[15px] font-medium transition-all duration-200 truncate ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
    }`;

  const riskSubItemClass = (active) =>
    `flex items-center py-2.5 px-3 rounded-lg text-[14px] font-normal transition-all duration-200 ml-2 ${isCollapsed ? 'justify-center px-2' : 'pl-9'} ${
      active ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
    }`;

  const userSectionClass = `mt-auto relative flex items-center gap-3 p-3 rounded-lg border transition-colors duration-300 truncate ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`;

  const dropdownClass = `absolute bottom-full mb-2 left-0 right-0 mx-3 border rounded-xl p-3 z-50 backdrop-blur-sm transition-colors duration-300 ${
    darkMode ? 'bg-gray-700/95 border-gray-600 text-white' : 'bg-white/95 border-gray-200 text-gray-800'
  }`;

  const dropdownItemClass = `flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-blue-50 hover:text-blue-700'}`;

  const dividerClass = `my-3 border-t transition-colors duration-300 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`;

  const divisionButtonClass = `w-full p-3 rounded-xl border transition-all duration-300 cursor-pointer group truncate ${
    darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-200'
  }`;

  const divisionDropdownClass = `absolute top-full left-0 right-0 mt-2 border rounded-xl p-3 z-50 backdrop-blur-sm transition-colors duration-300 ${
    darkMode ? 'bg-gray-700/95 border-gray-600 text-white' : 'bg-white/95 border-gray-200 text-gray-800'
  }`;

  const divisionOptionClass = `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 cursor-pointer group ${darkMode ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-blue-50 hover:text-blue-700'}`;

  // Resize handle component
  const ResizeHandle = () => (
    <div
      className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors duration-200 hover:bg-blue-500 active:bg-blue-600 group ${darkMode ? 'hover:bg-blue-400' : ''}`}
      onMouseDown={() => setIsResizing(true)}
      title="Drag to resize"
    >
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-full bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  // Toggle collapse button
  const CollapseToggle = () => (
    <button
      onClick={handleToggleCollapse}
      className={`absolute -right-3 top-6 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 z-10 shadow-md ${
        darkMode ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
      }`}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
    </button>
  );

  // Custom scrollbar styles
  const scrollbarClass = `
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
    .sidebar-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: ${darkMode ? 'rgba(156, 163, 175, 0.3) transparent' : 'rgba(156, 163, 175, 0.3) transparent'};
    }
  `;

  // Render collapsed content (icon only)
  const renderCollapsedContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo - Small */}
      <div className="flex justify-center mb-8 mt-6 flex-shrink-0 px-2">
        <img src={logo} alt="PNM" className="w-10 h-auto transition-all duration-300" />
      </div>

      {/* Navigation Menu - Icon Only */}
      <div className="flex-1 overflow-y-auto sidebar-scrollbar px-2">
        <nav className="space-y-2">
          {/* Dashboard */}
          <Link to="/dashboard" className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard', true) ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}>
            <FaHome className="w-5 h-5" />
          </Link>

          {/* Risk Appetite Statement */}
          <Link to="/dashboard/ras" className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/ras') ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}>
            <FaChartPie className="w-5 h-5" />
          </Link>

          {/* Repository */}
          <Link to="/dashboard/repository" className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/repository') ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}>
            <FaBook className="w-5 h-5" />
          </Link>

          {/* Profil Resiko Holding */}
          <button
            onClick={() => setOpenRisk(!openRisk)}
            className={`p-3 rounded-lg w-full flex justify-center ${isActive('/dashboard/risk-form') ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
          >
            <FaShieldAlt className="w-5 h-5" />
          </button>

          {openRisk && (
            <div className="space-y-1">
              {riskItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path} className={`p-2 rounded-lg flex justify-center ${active ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-100'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Profil Resiko OJK */}
          <button
            onClick={() => setOpenOjkRisk(!openOjkRisk)}
            className={`p-3 rounded-lg w-full flex justify-center ${isActive('/dashboard/ojk') ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
          >
            <FaBuildingIcon className="w-5 h-5" />
          </button>

          {openOjkRisk && (
            <div className="space-y-1">
              {ojkRiskItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path} className={`p-2 rounded-lg flex justify-center ${active ? 'bg-blue-500 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-100'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Maturitas Manajemen Risiko */}
          <Link to="/dashboard/maturasi" className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/maturasi', true) ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}>
            <FaChartLine className="w-5 h-5" />
          </Link>

          {/* Rekap Data */}
          <Link to="/dashboard/report" className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/report', true) ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}>
            <FaFileAlt className="w-5 h-5" />
          </Link>

          <div className={dividerClass} />

          {/* Notification */}
          <Link
            to="/dashboard/notification"
            className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/notification', true) ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
          >
            <FaBell className="w-5 h-5" />
          </Link>

          {/* Audit Log */}
          <Link
            to="/dashboard/audit-log"
            className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/audit-log', true) ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
          >
            <FaHistory className="w-5 h-5" />
          </Link>

          {/* Settings */}
          <Link to="/dashboard/settings" className={`p-3 rounded-lg flex justify-center ${isActive('/dashboard/settings', true) ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}>
            <FaSlidersH className="w-5 h-5" />
          </Link>
        </nav>
      </div>

      {/* User Profile - Icon Only */}
      <div className="relative px-2 pb-2" ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg w-full flex justify-center hover:opacity-80 transition-opacity">
          <Avatar src={user?.photoURL} name={user?.userID || 'U'} size="36" round color={darkMode ? '#60A5FA' : '#2563EB'} />
        </button>
      </div>
    </div>
  );

  // Render expanded content (full text)
  const renderExpandedContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mb-8 mt-6 flex-shrink-0 px-3">
        <img src={logo} alt="PNM" className="w-40 h-auto transition-all duration-300 hover:scale-105" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 px-3">
        {/* Division Selector */}
        <div className="relative mb-6 flex-shrink-0" ref={divisionRef}>
          <div className={divisionButtonClass} onClick={() => setDivisionDropdownOpen(!divisionDropdownOpen)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedDivision.color} text-white flex-shrink-0`}>
                  <FaBuilding className="text-sm" />
                </div>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span className="font-semibold text-sm truncate w-full">{selectedDivision.name}</span>
                  <span className="text-xs opacity-60 truncate w-full">{user?.role || 'User'}</span>
                </div>
              </div>
              <ChevronsUpDown size={16} className={`transition-transform duration-300 flex-shrink-0 ${divisionDropdownOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedDivision.divisi_id === division.divisi_id ? 'bg-white text-blue-600' : division.color}`}>
                          <FaBuilding className="text-xs" />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">{division.name}</span>
                          <span className="text-xs opacity-60 truncate">{division.description}</span>
                        </div>
                        {selectedDivision.divisi_id === division.divisi_id && <FaCheck className="text-blue-500 text-sm flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar pr-1">
          <nav className="space-y-2">
            <div className="space-y-1">
              {/* Dashboard */}
              <Link to="/dashboard" className={navItemClass(isActive('/dashboard', true))}>
                <FaHome className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Dashboard</span>
              </Link>

              {/* Risk Appetite Statement */}
              <Link to="/dashboard/ras" className={navItemClass(isActive('/dashboard/ras'))}>
                <FaChartPie className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Risk Appetite Statement</span>
              </Link>

              {/* Repository */}
              <Link to="/dashboard/repository" className={navItemClass(isActive('/dashboard/repository'))}>
                <FaBook className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Repository</span>
              </Link>

              {/* Profil Resiko Holding */}
              <div className="space-y-1">
                <button onClick={() => setOpenRisk(!openRisk)} className={`${riskButtonClass(isActive('/dashboard/risk-form'))}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FaShieldAlt className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate text-left">Profil Resiko Holding</span>
                  </div>
                  {openRisk ? <FaChevronUp className="text-xs flex-shrink-0" /> : <FaChevronDown className="text-xs flex-shrink-0" />}
                </button>

                <AnimatePresence>
                  {openRisk && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="ml-4 mt-1 space-y-1 border-l-2 pl-3 py-1">
                        {riskItems.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <Link key={item.path} to={item.path} className={riskSubItemClass(active)}>
                              <span className="truncate w-full">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profil Resiko OJK - MENU TERPISAH */}
              <div className="space-y-1" ref={ojkRiskRef}>
                <button onClick={() => setOpenOjkRisk(!openOjkRisk)} className={`${riskButtonClass(isActive('/dashboard/ojk'))}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FaBuildingIcon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate text-left">Profil Resiko OJK</span>
                  </div>
                  {openOjkRisk ? <FaChevronUp className="text-xs flex-shrink-0" /> : <FaChevronDown className="text-xs flex-shrink-0" />}
                </button>

                <AnimatePresence>
                  {openOjkRisk && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="ml-4 mt-1 space-y-1 border-l-2 pl-3 py-1 max-h-80 overflow-y-auto sidebar-scrollbar">
                        {ojkRiskItems.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <Link key={item.path} to={item.path} className={riskSubItemClass(active)}>
                              <span className="truncate w-full">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Maturitas Manajemen Risiko */}
              <Link to="/dashboard/maturasi" className={navItemClass(isActive('/dashboard/maturasi', true))}>
                <FaChartLine className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Maturitas Manajemen Risiko</span>
              </Link>

              {/* Rekap Data */}
              <Link to="/dashboard/report" className={navItemClass(isActive('/dashboard/report', true))}>
                <FaFileAlt className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Rekap Data</span>
              </Link>

              <div className={dividerClass} />

              {/* Notification */}
              <Link to="/dashboard/notification" className={navItemClass(isActive('/dashboard/notification', true))}>
                <FaBell className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Notification</span>
              </Link>

              {/* Audit Log */}
              <Link to="/dashboard/audit-log" className={navItemClass(isActive('/dashboard/audit-log', true))}>
                <FaHistory className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Audit Log</span>
              </Link>

              {/* Settings */}
              <Link to="/dashboard/settings" className={navItemClass(isActive('/dashboard/settings', true))}>
                <FaSlidersH className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* User Profile Section */}
      <div className={`${userSectionClass} mx-3 mb-2`} ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity min-w-0">
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
                  navigate('/dashboard/profile');
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
                  navigate('/login');
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
  );

  return (
    <>
      <style>{scrollbarClass}</style>

      <div ref={sidebarRef} className={`${sidebarClass} transition-all duration-300 relative`} style={{ width: `${sidebarWidth}px` }}>
        <ResizeHandle />
        <CollapseToggle />

        {isCollapsed ? renderCollapsedContent() : renderExpandedContent()}
      </div>
    </>
  );
};

export default Sidebar;
