import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarCheck, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaUserTie, 
  FaSignOutAlt 
} from "react-icons/fa";

const QuickSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navLinks = [
    { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard", end: true },
    { to: "/employees", icon: <FaUsers />, label: "Employees" },
    { to: "/attendance", icon: <FaCalendarCheck />, label: "Attendance" },
    { to: "/leave", icon: <FaCalendarAlt />, label: "Leave" },
    { to: "/profile", icon: <FaUserCircle />, label: "Profile" },
  ];
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: collapsed ? '70px' : '250px',
      backgroundColor: '#003C43',
      color: 'white',
      zIndex: 1000,
      padding: '20px 0',
      transition: 'width 0.3s ease',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div
        onClick={toggleSidebar}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '30px',
          color: 'white',
          textDecoration: 'none',
          height: '60px',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontSize: '24px',
          marginRight: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '30px'
        }}>
          <FaUserTie style={{fontSize:'1.35em', color:'#fff'}} />
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
            <span style={{
              fontSize: '20px',
              marginRight: '15px',
              minWidth: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
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
          onClick={() => console.log('Logout clicked')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            padding: '12px 15px',
            margin: '5px 0',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '5px',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <span style={{
            fontSize: '20px',
            marginRight: '15px',
            minWidth: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
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
