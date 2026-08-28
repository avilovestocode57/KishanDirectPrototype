import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole, activeRole, children }) {
  const currentRole = activeRole || localStorage.getItem('kd_active_role');

  if (!currentRole) {
    // Unauthenticated user attempting to access a protected area
    return <Navigate to="/home" replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    // Authenticated user trying to access a different role's area
    switch (currentRole) {
      case 'farmer':
        return <Navigate to="/farmer/dashboard" replace />;
      case 'user':
        return <Navigate to="/consumer/marketplace" replace />;
      case 'enterprise':
        return <Navigate to="/enterprise/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/overview" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  return children;
}
