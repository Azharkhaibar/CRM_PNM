import React from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../../shared/components/Darkmodecontext';

export default function DashboardLayout() {
  const { darkMode } = useDarkMode();
  const [sidebarWidth, setSidebarWidth] = React.useState(280);

  const handleSidebarWidthChange = (width) => {
    setSidebarWidth(width);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden`}>
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-30" style={{ width: `${sidebarWidth}px` }}>
        <div className={`h-full border-r ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Sidebar onWidthChange={handleSidebarWidthChange} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        {/* Fixed Navbar */}
        <div className={`flex-shrink-0 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Navbar />
        </div>

        {/* Scrollable Content Area - HANYA VERTICAL */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <main className={`min-h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Fixed Footer */}
        <footer className={`flex-shrink-0 py-4 px-6 border-t ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
          <div className="text-sm text-center">© {new Date().getFullYear()} RIMS Dashboard. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}
