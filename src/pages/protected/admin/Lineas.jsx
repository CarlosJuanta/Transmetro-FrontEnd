import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLineas, createLinea, updateLinea, deleteLinea } from '../../../services/admin/linea.service';
import { getAllMunicipalidades } from '../../../services/admin/municipalidad.service';
import { getReporteEstadoLineas } from '../../../services/operador/reporte.service';

const initialFormState = { id_linea: null, nombre: '', id_municipalidad: '' };

const Lineas = () => {
  const [lineas, setLineas] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [estadoLineas, setEstadoLineas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [lineasData, munisData, estadoData] = await Promise.all([
        getAllLineas(),
        getAllMunicipalidades(),
        getReporteEstadoLineas()
      ]);
      setLineas(lineasData);
      setMunicipalidades(munisData);
      setEstadoLineas(estadoData);
    } catch (err) {
      setError('No se pudieron cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

    const lineaData = { nombre: formData.nombre, id_municipalidad: formData.id_municipalidad };
    try {
      if (isEditMode) {
        await updateLinea(formData.id_linea, lineaData);
      } else {
        await createLinea(lineaData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la línea.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (linea) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({ id_linea: linea.id_linea, nombre: linea.nombre, id_municipalidad: linea.id_municipalidad });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta línea?')) {
        try {
            await deleteLinea(id);
            fetchData();
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar la línea.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setFormError(null);
    setFormData(initialFormState);
  };

  const getEstadoParaLinea = (id_linea) => {
    return estadoLineas.find(e => e.id_linea === id_linea);
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <h2>Lista de Líneas</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre Línea</th>
                  <th>Municipalidad</th>
                  <th>Estado (Buses/Estaciones)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea) => {
                  const estado = getEstadoParaLinea(linea.id_linea);
                  return (
                    <tr key={linea.id_linea}>
                      <td>{linea.nombre}</td>
                      <td>{linea.nombre_municipalidad}</td>
                      <td>
                        {estado ? (
                          estado.esConsistente ? (
                            <span className="badge bg-success">Consistente ({estado.totalBuses}/{estado.limiteMinimo}+)</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Requiere Atención ({estado.totalBuses}/{estado.limiteMinimo})</span>
                          )
                        ) : (
                          <span className="badge bg-secondary">N/A</span>
                        )}
                      </td>
                      <td>
                        <Link to={`/lineas/${linea.id_linea}/ruta`} className="btn btn-sm btn-info me-2">Ruta</Link>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(linea)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(linea.id_linea)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditMode ? 'Editar Línea' : 'Nueva Línea'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3"><label htmlFor="nombre" className="form-label">Nombre</label><input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required /></div>
                <div className="mb-3"><label htmlFor="id_municipalidad" className="form-label">Municipalidad</label><select className="form-select" name="id_municipalidad" value={formData.id_municipalidad} onChange={handleInputChange} required ><option value="">Seleccione una municipalidad</option>{municipalidades.map(muni => (<option key={muni.id_municipalidad} value={muni.id_municipalidad}>{muni.nombre}</option>))}</select></div>
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <div className="d-grid gap-2"><button type="submit" className="btn btn-primary">{isEditMode ? 'Actualizar' : 'Crear'}</button>{isEditMode && (<button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar Edición</button>)}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lineas;