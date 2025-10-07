import React, { useState, useEffect } from 'react';
import { getAllDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento } from '../../../services/admin/departamento.service';

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [formData, setFormData] = useState({ id_departamento: null, nombre: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

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

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, nombre: e.target.value });
  };

  const resetForm = () => {
    setIsEditMode(false);
    setFormError(null);
    setFormData({ id_departamento: null, nombre: '' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.nombre.trim()) {
      setFormError('El nombre del departamento es obligatorio.');
      return;
    }
    
    try {
      if (isEditMode) {
        await updateDepartamento(formData.id_departamento, formData.nombre);
      } else {
        await createDepartamento(formData.nombre);
      }
      resetForm();
      fetchDepartamentos();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el departamento.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (depto) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({ id_departamento: depto.id_departamento || depto.id, nombre: depto.nombre });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      try {
        await deleteDepartamento(id);
        fetchDepartamentos();
      } catch (err) {
        const message = err.response?.data?.message || 'Error al eliminar el departamento.';
        alert(message);
      }
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
            <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
              {departamentos.map((depto) => (
                <tr key={depto.id_departamento || depto.id}>
                  <td>{depto.id_departamento || depto.id}</td>
                  <td>{depto.nombre}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(depto)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(depto.id_departamento || depto.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditMode ? 'Editar Departamento' : 'Nuevo Departamento'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombreDepartamento" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombreDepartamento" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">{isEditMode ? 'Actualizar' : 'Crear'}</button>
                    {isEditMode && (<button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>)}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departamentos;