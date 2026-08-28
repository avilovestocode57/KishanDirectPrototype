import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Auth from './auth';
import FarmerApp from './farmer/FarmerApp';
import ConsumerApp from './consumer/ConsumerApp';
import AdminApp from './admin/AdminApp';
import EnterpriseApp from './enterprise/EnterpriseApp';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './NotFound';

function AppRoutes() {
  const [role, setRole] = useState(() => localStorage.getItem('kd_active_role'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('kd_active_role', selectedRole);
    switch (selectedRole) {
      case 'farmer':
        navigate('/farmer/dashboard');
        break;
      case 'user':
        navigate('/consumer/marketplace');
        break;
      case 'enterprise':
        navigate('/enterprise/dashboard');
        break;
      case 'admin':
        navigate('/admin/overview');
        break;
      default:
        navigate('/home');
    }
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem('kd_active_role');
    navigate('/home');
  };

  // Synchronize state and clear role when visiting /home
  useEffect(() => {
    if (location.pathname === '/home') {
      if (role || localStorage.getItem('kd_active_role')) {
        setRole(null);
        localStorage.removeItem('kd_active_role');
      }
    } else {
      const saved = localStorage.getItem('kd_active_role');
      if (saved !== role) {
        setRole(saved);
      }
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Root redirects to /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public Landing & Role Selection at /home */}
      <Route
        path="/home"
        element={<Auth onSelectRole={handleSelectRole} />}
      />

      {/* Role-Protected Route Branches */}
      <Route
        path="/farmer/*"
        element={
          <ProtectedRoute allowedRole="farmer" activeRole={role}>
            <FarmerApp onBack={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/consumer/*"
        element={
          <ProtectedRoute allowedRole="user" activeRole={role}>
            <ConsumerApp onBack={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/enterprise/*"
        element={
          <ProtectedRoute allowedRole="enterprise" activeRole={role}>
            <EnterpriseApp onBack={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="admin" activeRole={role}>
            <AdminApp onBack={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
