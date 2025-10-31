import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import QuickSidebar from './QuickSidebar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <>
      <QuickSidebar onToggle={handleSidebarToggle} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
