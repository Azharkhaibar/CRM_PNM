import React from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../../shared/components/Darkmodecontext';

export default function DashboardLayout() {
  const { darkMode } = useDarkMode();

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark-mode-bg' : 'bg-gray-100'}`}>
      <div className={`w-64 border-r fixed left-0 top-0 h-full ${darkMode ? 'dark-mode-bg-sidebar dark-mode-border' : 'bg-white border-gray-200'}`}>
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 ml-64 relative min-h-screen">
        <div className={`border-b ${darkMode ? 'dark-mode-bg-navbar dark-mode-border' : 'bg-white border-gray-200'}`}>
          <Navbar />
        </div>

        <main
          className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'dark-mode-bg text-white' : 'bg-gray-100 text-gray-900'}`}
          style={{ paddingBottom: '3rem' }}
        >
          <Outlet />
        </main>

        <footer className={`fixed bottom-0 left-64 right-0 text-center text-sm py-3 border-t z-40 ${darkMode ? 'dark-mode-border text-gray-400 bg-gray-800' : 'text-gray-500 bg-white border-gray-200'}`}>
          © {new Date().getFullYear()} RIMS Dashboard. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
