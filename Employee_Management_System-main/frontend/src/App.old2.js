import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import QuickSidebar from './components/QuickSidebar.test';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import PostUser from './pages/employee/PostUser';
import UpdateUser from './pages/employee/UpdateUser';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NoMatch from './pages/noMatch/NoMatch';
import Employees from './pages/employee/Employees';
import Attendance from './pages/attendance/Attendance';
import Leave from './pages/leave/Leave';
import Profile from './pages/profile/Profile';

function AppContent() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <QuickSidebar />
      <div style={{
        flex: 1,
        marginLeft: '250px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        transition: 'margin 0.3s ease'
      }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/employee/add" element={<PostUser />} />
          <Route path="/employee/edit/:id" element={<UpdateUser />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
