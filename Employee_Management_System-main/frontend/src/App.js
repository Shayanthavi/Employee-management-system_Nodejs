import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import Layout from './components/Layout';

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
import Reports from './pages/reports/Reports';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/employee/add" element={<PostUser />} />
            <Route path="/employee/edit/:id" element={<UpdateUser />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
