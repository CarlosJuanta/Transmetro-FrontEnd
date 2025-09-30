import React, { useState, useEffect } from 'react';
import { getAllMunicipalidades, createMunicipalidad, updateMunicipalidad, deleteMunicipalidad } from '../../../services/admin/municipalidad.service';
import { getAllDepartamentos } from '../../../services/admin/departamento.service';

const Municipalidades = () => {
  const [municipalidades, setMunicipalidades] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ id_municipalidad: null, nombre: '', id_departamento: '' });
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [muniData, deptoData] = await Promise.all([
          getAllMunicipalidades(),
          getAllDepartamentos()
        ]);
        setMunicipalidades(muniData);
        setDepartamentos(deptoData);
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
    if (!formData.nombre.trim() || !formData.id_departamento) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (isEditMode) {
        await updateMunicipalidad(formData.id_municipalidad, formData.nombre, formData.id_departamento);
        setMunicipalidades(municipalidades.map(muni => 
          muni.id_municipalidad === formData.id_municipalidad ? { ...muni, nombre: formData.nombre, id_departamento: parseInt(formData.id_departamento) } : muni
        ));
      } else {
        const nuevaMuni = await createMunicipalidad(formData.nombre, formData.id_departamento);
        setMunicipalidades([...municipalidades, nuevaMuni]);
      }
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la municipalidad.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (muni) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({
        id_municipalidad: muni.id_municipalidad,
        nombre: muni.nombre,
        id_departamento: muni.id_departamento
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta municipalidad?')) {
        try {
            await deleteMunicipalidad(id);
            setMunicipalidades(municipalidades.filter(muni => muni.id_municipalidad !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar la municipalidad.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setFormError(null);
    setFormData({ id_municipalidad: null, nombre: '', id_departamento: '' });
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2>Lista de Municipalidades</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {municipalidades.map((muni) => (
                <tr key={muni.id_municipalidad}>
                  <td>{muni.nombre}</td>
                  <td>{muni.nombre_departamento}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(muni)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(muni.id_municipalidad)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditMode ? 'Editar Municipalidad' : 'Nueva Municipalidad'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="id_departamento" className="form-label">Departamento</label>
                  <select
                    className="form-select"
                    id="id_departamento"
                    name="id_departamento"
                    value={formData.id_departamento}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map(depto => (
                      <option key={depto.id_departamento || depto.id} value={depto.id_departamento || depto.id}>
                        {depto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Actualizar' : 'Crear'}
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

export default Municipalidades;