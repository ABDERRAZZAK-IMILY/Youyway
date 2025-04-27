import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

import { Outlet } from 'react-router-dom';


export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1 overflow-auto">
        <Outlet />
        </main>
      </div>
    </div>
  );
}
