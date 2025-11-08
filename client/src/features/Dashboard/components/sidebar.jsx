import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/pnm-pnmim.png';
import { FaChevronDown, FaChevronUp, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-avatar';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [openRisk, setOpenRisk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const nvg = useNavigate();

  useEffect(() => {
    if (pathname.startsWith('/dashboard/risk-form')) {
      setOpenRisk(true);
    }
  }, [pathname]);

  // Tutup dropup ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const riskItems = ['investasi', 'pasar', 'likuiditas', 'operasional', 'hukum', 'stratejik', 'kepatuhan', 'reputasi'];

  const isRiskActive = pathname.startsWith('/dashboard/risk-form');

  return (
    <div className="bg-white w-64 h-screen border-r p-4 flex flex-col">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="PNM" className="w-48 mt-6 object-contain" />
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`block py-2 px-4 rounded-lg text-[18px] font-medium transition 
                ${pathname === '/dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-blue-100'}`}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <button
              onClick={() => setOpenRisk(!openRisk)}
              className={`w-full flex items-center justify-between py-2 px-4 rounded-lg text-[18px] font-medium transition
                ${isRiskActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-blue-100'}`}
            >
              <span className="flex items-center gap-2">Risk Form</span>
              {openRisk ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {openRisk && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="ml-4 mt-2 space-y-1 border-l pl-3 border-gray-300 overflow-hidden"
                >
                  {riskItems.map((item) => {
                    const itemPath = `/dashboard/risk-form/${item}`;
                    const active = pathname === itemPath;
                    return (
                      <li key={item}>
                        <Link
                          to={itemPath}
                          className={`block py-1.5 px-3 rounded-md text-[16px] capitalize transition 
                            ${active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}
                        >
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
            <Link
              to="/dashboard/report"
              className={`block py-2 px-4 rounded-lg text-[18px] font-medium transition 
                ${pathname === '/dashboard/report' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-blue-100'}`}
            >
              Report
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/settings"
              className={`block py-2 px-4 rounded-lg text-[18px] font-medium transition 
                ${pathname === '/dashboard/settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-blue-100'}`}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto relative flex items-center gap-3 p-3 border-t border-gray-200" ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-start gap-3 w-full">
          <Avatar src={user?.photoURL} name={user?.userID || 'User'} size="40" round={true} color="#2563EB" />
          <div className="flex-1 flex flex-col items-start justify-center">
            <div className="font-medium text-gray-800 text-left">{user?.userID || 'Nama User'}</div>
            <div className="text-sm text-gray-500 text-left">{user?.role || 'Divisi / Role'}</div>
          </div>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 left-0 w-52 bg-white border rounded-lg shadow-lg p-2 z-50"
            >
              <button onClick={() => console.log('Go to Profile')} className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 rounded">
                <FaUserCircle />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => {
                  logout(); 
                  nvg('/login');
                }}
                className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 rounded text-red-600"
              >
                <FaSignOutAlt />
                <span className="text-sm">Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
