import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (

    <>
      <div className="min-h-screen flex bg-gray-50">
        <aside className='fixed z-50'>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onMenuClick={() => setIsSidebarOpen(true)}
            pageTitle="Dashboard"
          />
          <main className="flex-1 lg:ml-64 p-4 lg:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;