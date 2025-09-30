import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <main className="d-flex align-items-center min-vh-100 py-3 py-md-0">
      <Outlet />
    </main>
  );
};

export default AuthLayout;