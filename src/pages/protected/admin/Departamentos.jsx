import React, { useState, useEffect } from 'react';
import { getAllDepartamentos, createDepartamento } from '../../../services/admin/departamento.service';

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      setIsLoading(true);
      try {
        const data = await getAllDepartamentos();
        setDepartamentos(data);
      } catch (err) {
        setError('No se pudieron cargar los departamentos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartamentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!nombre.trim()) {
      setFormError('El nombre del departamento es obligatorio.');
      return;
    }
    
    try {
      const nuevoDepartamento = await createDepartamento(nombre);
      setDepartamentos([...departamentos, nuevoDepartamento]);
      setNombre('');
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear el departamento.';
      setFormError(message);
    }
  };

  if (isLoading) return <p>Cargando departamentos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2>Lista de Departamentos</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.map((depto) => (
                <tr key={depto.id_departamento || depto.id}>
                  <td>{depto.id_departamento || depto.id}</td>
                  <td>{depto.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nuevo Departamento</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombreDepartamento" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreDepartamento"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <button type="submit" className="btn btn-primary w-100">
                  Crear Departamento
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departamentos;