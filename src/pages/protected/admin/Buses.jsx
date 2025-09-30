import React, { useState, useEffect } from 'react';
import { getAllBuses, createBus, updateBus, deleteBus, getAllParqueos } from '../../../services/admin/bus.service';
import { getAllLineas } from '../../../services/admin/linea.service';

const initialFormState = { id_bus: null, placa: '', capacidad_maxima: '', id_linea: '', id_parqueo: '' };

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [parqueos, setParqueos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [busesData, lineasData, parqueosData] = await Promise.all([
          getAllBuses(),
          getAllLineas(),
          getAllParqueos()
        ]);
        setBuses(busesData);
        setLineas(lineasData);
        setParqueos(parqueosData);
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
    
    const busData = {
        placa: formData.placa,
        capacidad_maxima: formData.capacidad_maxima,
        id_linea: formData.id_linea || null,
        id_parqueo: formData.id_parqueo
    };

    try {
      if (isEditMode) {
        await updateBus(formData.id_bus, busData);
      } else {
        await createBus(busData);
      }
      const updatedBuses = await getAllBuses();
      setBuses(updatedBuses);
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el bus.`;
      setFormError(message);
    }
  };
  
  const handleEdit = (bus) => {
    setIsEditMode(true);
    setFormError(null);
    setFormData({
        id_bus: bus.id_bus,
        placa: bus.placa,
        capacidad_maxima: bus.capacidad_maxima,
        id_linea: bus.id_linea || '',
        id_parqueo: bus.id_parqueo
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este bus?')) {
        try {
            await deleteBus(id);
            setBuses(buses.filter(bus => bus.id_bus !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar el bus.';
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
          <h2>Lista de Buses</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Capacidad</th>
                  <th>Línea Asignada</th>
                  <th>Parqueo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id_bus}>
                    <td>{bus.placa}</td>
                    <td>{bus.capacidad_maxima}</td>
                    <td>{bus.nombre_linea || 'Sin Asignar'}</td>
                    <td>{bus.nombre_parqueo}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(bus)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(bus.id_bus)}>Eliminar</button>
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
              <h5 className="card-title">{isEditMode ? 'Editar Bus' : 'Nuevo Bus'}</h5>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" name="placa" value={formData.placa} onChange={handleInputChange} placeholder="Placa" required />
                <input type="number" className="form-control mb-2" name="capacidad_maxima" value={formData.capacidad_maxima} onChange={handleInputChange} placeholder="Capacidad Máxima" required />
                <select className="form-select mb-2" name="id_linea" value={formData.id_linea} onChange={handleInputChange}>
                  <option value="">Asignar Línea (Opcional)</option>
                  {lineas.map(linea => (
                    <option key={linea.id_linea} value={linea.id_linea}>{linea.nombre}</option>
                  ))}
                </select>
                <select className="form-select mb-3" name="id_parqueo" value={formData.id_parqueo} onChange={handleInputChange} required>
                  <option value="">Seleccione un Parqueo</option>
                  {parqueos.map(parqueo => (
                    <option key={parqueo.id_parqueo} value={parqueo.id_parqueo}>{parqueo.nombre} ({parqueo.nombre_estacion})</option>
                  ))}
                </select>
                
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

export default Buses;