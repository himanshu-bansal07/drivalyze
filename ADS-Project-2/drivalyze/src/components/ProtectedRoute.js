import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';

/**
 * A protected route component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.redirectTo='/login'] - Path to redirect to if not authenticated
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ 
  isAuthenticated, 
  children, 
  redirectTo = '/login' 
}) => {
  const location = useLocation();
  
  // If not authenticated, redirect to login page with the return url
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
