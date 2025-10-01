import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/public/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import Dashboard from './pages/protected/Dashboard';
import Departamentos from './pages/protected/admin/Departamentos';
import Municipalidades from './pages/protected/admin/Municipalidades';
import Roles from './pages/protected/admin/Roles';
import Usuarios from './pages/protected/admin/Usuarios';
import PersonalSeguridad from './pages/protected/admin/PersonalSeguridad';
import Pilotos from './pages/protected/admin/Pilotos';
import Estaciones from './pages/protected/admin/Estaciones';
import EstacionDetalle from './pages/protected/admin/EstacionDetalle';
import Lineas from './pages/protected/admin/Lineas';
import Buses from './pages/protected/admin/Buses';
import LineaDetalle from './pages/protected/admin/LineasDetalle';
import AsignacionesGuardias from './pages/protected/operador/AsignacionesGuardias';
import AsignacionesPilotos from './pages/protected/operador/AsignacionesPilotos';
import OperacionesEstacion from './pages/protected/operador/OperacionesEstacion';
import ReportesGenerales from './pages/protected/reportes/ReportesGenerales';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={[1]} />}>
            <Route path="/departamentos" element={<Departamentos />} />
            <Route path="/municipalidades" element={<Municipalidades />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/personal-seguridad" element={<PersonalSeguridad />} />
            <Route path="/pilotos" element={<Pilotos />} />
            <Route path="/estaciones" element={<Estaciones />} />
            <Route path="/estaciones/:id_estacion" element={<EstacionDetalle />} />
            <Route path="/lineas" element={<Lineas />} />
            <Route path="/lineas/:id_linea/ruta" element={<LineaDetalle />} />
            <Route path="/buses" element={<Buses />} />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={[1, 2]} />}>
            <Route path="/asignaciones-guardias" element={<AsignacionesGuardias />} />
            <Route path="/asignaciones-pilotos" element={<AsignacionesPilotos />} />
            <Route path="/operaciones" element={<OperacionesEstacion />} />
            <Route path="/reportes" element={<ReportesGenerales />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;