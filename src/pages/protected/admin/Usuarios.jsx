import React, { useState, useEffect } from 'react';
import { getAllUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../../services/admin/usuario.service';
import { getAllRoles } from '../../../services/admin/rol.service';
import { getAllEstaciones } from '../../../services/admin/estacion.service';

const initialFormState = {
  id_usuario: null,
  nombre: '',
  apellido: '',
  correo: '',
  contrasenia: '',
  id_rol: '',
  id_estacion: ''
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersData, rolesData, estacionesData] = await Promise.all([
          getAllUsuarios(),
          getAllRoles(),
          getAllEstaciones()
        ]);
        setUsuarios(usersData);
        setRoles(rolesData);
        setEstaciones(estacionesData);
      } catch (err) {
        setError('No se pudieron cargar los datos necesarios.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        id_rol: formData.id_rol,
        id_estacion: formData.id_estacion || null,
    };

    try {
      if (isEditMode) {
        const usuarioActualizado = await updateUsuario(formData.id_usuario, userData);
        setUsuarios(usuarios.map(user => user.id_usuario === formData.id_usuario ? usuarioActualizado : user));
      } else {
        userData.contrasenia = formData.contrasenia;
        const nuevoUsuario = await createUsuario(userData);
        setUsuarios([...usuarios, nuevoUsuario]);
      }
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el usuario.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (user) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        contrasenia: '',
        id_rol: user.id_rol,
        id_estacion: user.id_estacion || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        try {
            await deleteUsuario(id);
            setUsuarios(usuarios.filter(user => user.id_usuario !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar el usuario.';
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
          <h2>Lista de Usuarios</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estación Asignada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id_usuario}>
                    <td>{user.nombre} {user.apellido}</td>
                    <td>{user.correo}</td>
                    <td>{user.tipo_rol}</td>
                    <td>{user.nombre_estacion || 'N/A'}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id_usuario)}>Eliminar</button>
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
              <h5 className="card-title">{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-2"><input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required /></div>
                <div className="mb-2"><input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" required /></div>
                <div className="mb-2"><input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo Electrónico" required /></div>
                {!isEditMode && (
                  <div className="mb-2"><input type="password" className="form-control" name="contrasenia" value={formData.contrasenia} onChange={handleInputChange} placeholder="Contraseña" required /></div>
                )}
                <div className="mb-2">
                    <select className="form-select" name="id_rol" value={formData.id_rol} onChange={handleInputChange} required>
                        <option value="">Seleccione un Rol</option>
                        {roles.map(rol => (<option key={rol.id_rol} value={rol.id_rol}>{rol.tipo_rol}</option>))}
                    </select>
                </div>
                <div className="mb-3">
                    <select className="form-select" name="id_estacion" value={formData.id_estacion} onChange={handleInputChange}>
                        <option value="">Seleccione una Estación (Opcional)</option>
                        {estaciones.map(est => (<option key={est.id_estacion} value={est.id_estacion}>{est.nombre}</option>))}
                    </select>
                </div>
                
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

export default Usuarios;