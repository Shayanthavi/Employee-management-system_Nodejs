import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarCheck, 
  FaCalendarAlt, 
  FaRegChartBar, 
  FaUserTie, 
  FaSignOutAlt 
} from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';

const QuickSidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navLinks = [
  { to: "/dashboard", icon: <FaTachometerAlt className="quick-sidebar-icon" />, label: "Dashboard", end: true },
  { to: "/employees", icon: <FaUsers className="quick-sidebar-icon" />, label: "Employees" },
  { to: "/attendance", icon: <FaCalendarCheck className="quick-sidebar-icon" />, label: "Attendance" },
  { to: "/leave", icon: <FaCalendarAlt className="quick-sidebar-icon" />, label: "Leave" },
  { to: "/reports", icon: <FaRegChartBar className="quick-sidebar-icon" />, label: "Reports" },
  ];
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Notify parent component when sidebar toggles
  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to login page
    navigate('/login', { replace: true });
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      height: 'calc(100vh - 40px)',
      width: collapsed ? '90px' : '260px',
      backgroundColor: '#003C43',
      color: 'white',
      zIndex: 1000,
      padding: '20px 10px',
      transition: 'width 0.22s cubic-bezier(.4,0,.2,1)',
      boxShadow: '0 4px 24px 0 rgba(0, 60, 67, 0.1)',
      borderRadius: '18px'
    }}>
      <div
        onClick={toggleSidebar}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 15px',
          marginBottom: '30px',
          color: 'white',
          textDecoration: 'none',
          height: '60px',
          cursor: 'pointer'
        }}
      >
          <span style={{
            fontSize: '2.2rem',
            marginRight: '0',
            minWidth: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '44px',
          width: '44px'
        }}>
          <FaUserTie className="quick-sidebar-logo-icon" style={{color:'#fff', fontSize: collapsed ? '2.2rem' : '24px'}} />
        </span>
        {!collapsed && (
          <span style={{ 
            fontWeight: 600, 
            fontSize: '18px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            EmployeeMS
          </span>
        )}
      </div>
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 10px'
      }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              margin: '5px 0',
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              borderRadius: '5px',
              transition: 'all 0.2s',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              ':hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            })}
          >
            <span
              style={{
                fontSize: collapsed ? '2.2rem' : '20px',
                marginRight: '15px',
                minWidth: collapsed ? '25px' : '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {link.icon}
            </span>
            {!collapsed && (
              <span style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {link.label}
              </span>
            )}
          </NavLink>
        ))}
        
        <button 
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            padding: '12px 15px',
              margin: '70px 0 5px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '5px',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <span
            style={{
                fontSize: '2.2rem',
                marginRight: '0',
                minWidth: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              width: '44px'
            }}
          >
            <FaSignOutAlt />
          </span>
          {!collapsed && (
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Logout
            </span>
          )}
        </button>
      </nav>
    </div>
  );
};

export default QuickSidebar;