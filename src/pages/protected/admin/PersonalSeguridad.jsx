import React, { useState, useEffect } from 'react';
import { getAllPersonal, createPersonal, updatePersonal, deletePersonal } from '../../../services/admin/personal.service';

const initialFormState = { id_personal: null, nombre: '', apellido: '', telefono: '' };

const PersonalSeguridad = () => {
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchPersonal = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPersonal();
        setPersonal(data);
      } catch (err) {
        setError('No se pudo cargar el personal de seguridad.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonal();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.telefono.trim()) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    const personalData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
    };

    try {
      if (isEditMode) {
        await updatePersonal(formData.id_personal, personalData);
        setPersonal(personal.map(p => 
          p.id_personal === formData.id_personal ? { ...p, ...personalData } : p
        ));
      } else {
        const nuevoPersonal = await createPersonal(personalData);
        setPersonal([...personal, nuevoPersonal]);
      }
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el registro.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (p) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({
        id_personal: p.id_personal,
        nombre: p.nombre,
        apellido: p.apellido,
        telefono: p.telefono
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
        try {
            await deletePersonal(id);
            setPersonal(personal.filter(p => p.id_personal !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar el registro.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setFormError(null);
    setFormData(initialFormState);
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <h2>Personal de Seguridad</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personal.map((p) => (
                  <tr key={p.id_personal}>
                    <td>{p.nombre}</td>
                    <td>{p.apellido}</td>
                    <td>{p.telefono}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id_personal)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditMode ? 'Editar Personal' : 'Nuevo Personal'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-2"><input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required /></div>
                <div className="mb-2"><input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" required /></div>
                <div className="mb-3"><input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono" required /></div>
                
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">{isEditMode ? 'Actualizar' : 'Crear'}</button>
                  {isEditMode && (<button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar Edición</button>)}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSeguridad;