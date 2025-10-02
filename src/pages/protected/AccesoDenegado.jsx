import React from 'react';
import { Link } from 'react-router-dom';

const AccesoDenegado = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">403</h1>
      <h2>Acceso Denegado</h2>
      <p className="lead">
        No tienes los permisos necesarios para ver esta página.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al menu principal
      </Link>
    </div>
  );
};

export default AccesoDenegado;