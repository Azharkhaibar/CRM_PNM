import React from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white border-r fixed left-0 top-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 ml-64">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
