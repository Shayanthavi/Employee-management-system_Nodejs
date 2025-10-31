import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import QuickSidebar from './components/QuickSidebar';

// Layout Components
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import PostUser from './pages/employee/PostUser';
import UpdateUser from './pages/employee/UpdateUser';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NoMatch from './pages/noMatch/NoMatch';
import PrivateRoute from './components/PrivateRoute';
import Employees from './pages/employee/Employees';
import Attendance from './pages/attendance/Attendance';
import Leave from './pages/leave/Leave';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <AuthProvider>
      <QuickSidebar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          {/* ...existing code... */}
          <Route
            path="/employee"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <PostUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <PrivateRoute>
                <Leave />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/:id"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <UpdateUser />
              </PrivateRoute>
            }
          />
          {/* 404 Route */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
