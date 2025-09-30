import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../services/auth.service';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginService(correo, contrasenia);
      login(data.token);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contrasenia" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="contrasenia"
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;