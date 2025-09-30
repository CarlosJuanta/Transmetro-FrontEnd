import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEstaciones, createEstacion, updateEstacion, deleteEstacion } from '../../../services/admin/estacion.service';
import { getAllMunicipalidades } from '../../../services/admin/municipalidad.service';

const initialFormState = { id_estacion: null, nombre: '', id_municipalidad: '' };

const Estaciones = () => {
  const [estaciones, setEstaciones] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [estacionesData, munisData] = await Promise.all([
          getAllEstaciones(),
          getAllMunicipalidades()
        ]);
        setEstaciones(estacionesData);
        setMunicipalidades(munisData);
      } catch (err) {
        setError('No se pudieron cargar los datos.');
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
    if (!formData.nombre.trim() || !formData.id_municipalidad) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    const estacionData = {
        nombre: formData.nombre,
        id_municipalidad: formData.id_municipalidad
    };

    try {
      if (isEditMode) {
        await updateEstacion(formData.id_estacion, estacionData);
      } else {
        await createEstacion(estacionData);
      }
      const updatedEstaciones = await getAllEstaciones();
      setEstaciones(updatedEstaciones);
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la estación.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (estacion) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({
        id_estacion: estacion.id_estacion,
        nombre: estacion.nombre,
        id_municipalidad: estacion.id_municipalidad
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta estación?')) {
        try {
            await deleteEstacion(id);
            setEstaciones(estaciones.filter(est => est.id_estacion !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar la estación.';
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
          <h2>Lista de Estaciones</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre Estación</th>
                  <th>Municipalidad</th>
                  <th>Departamento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estaciones.map((estacion) => (
                  <tr key={estacion.id_estacion}>
                    <td>{estacion.nombre}</td>
                    <td>{estacion.nombre_municipalidad}</td>
                    <td>{estacion.nombre_departamento}</td>
                    <td>
                      <Link to={`/estaciones/${estacion.id_estacion}`} className="btn btn-sm btn-info me-2">Detalles</Link>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(estacion)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(estacion.id_estacion)}>Eliminar</button>
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
              <h5 className="card-title">{isEditMode ? 'Editar Estación' : 'Nueva Estación'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="id_municipalidad" className="form-label">Municipalidad</label>
                  <select className="form-select" name="id_municipalidad" value={formData.id_municipalidad} onChange={handleInputChange} required >
                    <option value="">Seleccione una municipalidad</option>
                    {municipalidades.map(muni => (
                      <option key={muni.id_municipalidad} value={muni.id_municipalidad}>{muni.nombre}</option>
                    ))}
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

export default Estaciones;