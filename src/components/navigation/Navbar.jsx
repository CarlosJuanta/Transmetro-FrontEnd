import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <span className="navbar-brand">Plataforma Transmetro</span>
        <div className="d-flex align-items-center">
          {usuario && (
            <span className="navbar-text me-3">
              USUARIO: {usuario.id_usuario} | Rol: {usuario.id_rol}
            </span>
          )}
          <button className="btn btn-outline-secondary" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;