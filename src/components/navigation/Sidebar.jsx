import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { usuario } = useAuth();

  const isAdmin = usuario?.id_rol === 1;
  const isOperator = usuario?.id_rol === 2;

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '280px', minHeight: '100vh' }}>
      <h4 className="mb-4">Menú Principal</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">
            Dashboard
          </NavLink>
        </li>

        {/* Enlaces de Administrador */}
        {isAdmin && (
          <>
            <li className="nav-item mt-3">
              <small className="text-muted">ADMINISTRACIÓN</small>
            </li>
            <li><NavLink to="/usuarios" className="nav-link">Usuarios</NavLink></li>
            <li><NavLink to="/roles" className="nav-link">Roles</NavLink></li>
            <li><NavLink to="/departamentos" className="nav-link">Departamentos</NavLink></li>
            <li><NavLink to="/municipalidades" className="nav-link">Municipalidades</NavLink></li>
            <li><NavLink to="/estaciones" className="nav-link">Estaciones</NavLink></li>
            <li><NavLink to="/lineas" className="nav-link">Líneas</NavLink></li>
            <li><NavLink to="/buses" className="nav-link">Buses</NavLink></li>
            <li><NavLink to="/pilotos" className="nav-link">Pilotos</NavLink></li>
            <li><NavLink to="/personal-seguridad" className="nav-link">Personal Seguridad</NavLink></li>
          </>
        )}

        {/* Enlaces de Operador */}
        {isOperator && (
           <>
            <li className="nav-item mt-3">
              <small className="text-muted">OPERACIONES</small>
            </li>
            <li><NavLink to="/operaciones" className="nav-link">Operaciones de Estación</NavLink></li>
            <li><NavLink to="/asignaciones-pilotos" className="nav-link">Asignaciones de Pilotos</NavLink></li>
            <li><NavLink to="/asignaciones-guardias" className="nav-link">Asignaciones de Guardias</NavLink></li>
           </>
        )}
         
        {/* Enlaces Comunes (Admin y Operador) */}
        {(isAdmin || isOperator) && (
            <>
            <li className="nav-item mt-3">
                <small className="text-muted">REPORTES</small>
            </li>
            <li><NavLink to="/reportes" className="nav-link">Reportes Generales</NavLink></li>
            </>
        )}
        
      </ul>
    </div>
  );
};

export default Sidebar;