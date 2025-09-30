import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import AccesoDenegado from '../pages/protected/AccesoDenegado';

const ProtectedRoute = ({ rolesPermitidos }) => {
  const { isAuthenticated, usuario, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const tienePermiso = rolesPermitidos ? rolesPermitidos.includes(usuario.id_rol) : true;

  if (!tienePermiso) {
    return <AccesoDenegado />;
  }
  
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;