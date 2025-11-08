import React from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../../shared/components/Darkmodecontext';
export default function DashboardLayout() {
  const { darkMode } = useDarkMode();

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark-mode-bg' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r fixed left-0 top-0 h-full ${darkMode ? 'dark-mode-bg-sidebar dark-mode-border' : 'bg-white border-gray-200'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Navbar */}
        <div className={`border-b ${darkMode ? 'dark-mode-bg-navbar dark-mode-border' : 'bg-white border-gray-200'}`}>
          <Navbar />
        </div>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-6 min-h-[calc(100vh-4rem)] ${darkMode ? 'dark-mode-bg' : 'bg-gray-100'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
