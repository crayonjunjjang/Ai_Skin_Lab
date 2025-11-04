import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('access_token');
  const isStaff = localStorage.getItem('is_staff') === 'true';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!isStaff) {
    // Redirect to home if user is not staff
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;