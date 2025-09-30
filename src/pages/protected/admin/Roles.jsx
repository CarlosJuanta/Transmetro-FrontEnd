import React, { useState, useEffect } from 'react';
import { getAllRoles, createRol, updateRol, deleteRol } from '../../../services/admin/rol.service';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ id_rol: null, tipo_rol: '' });
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch (err) {
        setError('No se pudieron cargar los roles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, tipo_rol: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.tipo_rol.trim()) {
      setFormError('El nombre del rol es obligatorio.');
      return;
    }

    try {
      if (isEditMode) {
        await updateRol(formData.id_rol, formData.tipo_rol);
        setRoles(roles.map(rol => 
          rol.id_rol === formData.id_rol ? { ...rol, tipo_rol: formData.tipo_rol } : rol
        ));
      } else {
        const nuevoRol = await createRol(formData.tipo_rol);
        setRoles([...roles, nuevoRol]);
      }
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el rol.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (rol) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({
        id_rol: rol.id_rol,
        tipo_rol: rol.tipo_rol
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
        try {
            await deleteRol(id);
            setRoles(roles.filter(rol => rol.id_rol !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar el rol.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setFormError(null);
    setFormData({ id_rol: null, tipo_rol: '' });
  };

  if (isLoading) return <p>Cargando roles...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2>Lista de Roles</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id_rol}>
                  <td>{rol.id_rol}</td>
                  <td>{rol.tipo_rol}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(rol)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rol.id_rol)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditMode ? 'Editar Rol' : 'Nuevo Rol'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="tipo_rol" className="form-label">Nombre del Rol</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tipo_rol"
                    name="tipo_rol"
                    value={formData.tipo_rol}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Actualizar Rol' : 'Crear Rol'}
                  </button>
                  {isEditMode && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;