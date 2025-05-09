import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;