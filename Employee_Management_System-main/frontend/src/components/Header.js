import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header = ({ sidebarCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const pageNames = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/employees": "Employees",
    "/employee": "Add Employee",
    "/attendance": "Attendance",
    "/leave": "Leave Management",
    "/profile": "Profile",
    "/settings": "Settings"
  };
  
  // Handle dynamic routes like /employee/:id
  let activePage = pageNames[location.pathname];
  
  if (!activePage) {
    if (location.pathname.startsWith('/employee/')) {
      activePage = "Edit Employee";
    } else {
      activePage = "Dashboard";
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`app-header ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <div className="header-left">
        <h1 className="page-title">{activePage}</h1>
      </div>

      <div className="header-right">
        <div className="header-date-time" style={{marginRight: '1.5rem', fontWeight: 500, color: 'var(--secondary, #4b3869)'}}>
          {new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
        <div className="header-divider"></div>
        <div 
          ref={dropdownRef} 
          className="user-section" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="user-avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username || 'User'}</span>
            <span className="user-role">Administrator</span>
          </div>
          <ChevronDown size={18} className="dropdown-icon" />
          {showDropdown && (
            <div className="user-dropdown-menu">
              <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); window.location.href = '/profile'; }}>
                <span>Profile</span>
              </div>
              <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); window.location.href = '/settings'; }}>
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div 
                className="dropdown-item logout" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  localStorage.removeItem('user'); 
                  localStorage.removeItem('token');
                  window.location.href = '/login'; 
                }}
              >
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
