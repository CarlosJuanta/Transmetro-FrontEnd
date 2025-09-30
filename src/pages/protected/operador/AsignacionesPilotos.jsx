import React, { useState, useEffect } from 'react';
import { getAllAsignacionesPiloto, createAsignacionPiloto, deleteAsignacionPiloto } from '../../../services/operador/asignacion.service';
import { getAllPilotos } from '../../../services/admin/piloto.service';
import { getAllBuses } from '../../../services/admin/bus.service';

const initialFormState = { id_piloto: '', id_bus: '', fecha_turno: '' };

const AsignacionesPilotos = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [asigData, pilotosData, busesData] = await Promise.all([
          getAllAsignacionesPiloto(),
          getAllPilotos(),
          getAllBuses()
        ]);
        setAsignaciones(asigData);
        setPilotos(pilotosData);
        setBuses(busesData);
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
    if (!formData.id_piloto || !formData.id_bus || !formData.fecha_turno) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const nuevaAsignacion = await createAsignacionPiloto(formData);
      setAsignaciones([nuevaAsignacion, ...asignaciones]);
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la asignación.';
      setFormError(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asignación?')) {
        try {
            await deleteAsignacionPiloto(id);
            setAsignaciones(asignaciones.filter(a => a.id_asignacion !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar la asignación.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <h2>Historial de Asignaciones de Pilotos</h2>
          <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Piloto</th>
                  <th>Bus (Placa)</th>
                  <th>Fecha y Hora del Turno</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((a) => (
                  <tr key={a.id_asignacion}>
                    <td>{a.nombre_completo_piloto}</td>
                    <td>{a.placa}</td>
                    <td>{new Date(a.fecha_turno).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id_asignacion)}>Eliminar</button>
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
              <h5 className="card-title">Nueva Asignación</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="id_piloto" className="form-label">Piloto</label>
                  <select className="form-select" name="id_piloto" value={formData.id_piloto} onChange={handleInputChange} required>
                    <option value="">Seleccione un piloto</option>
                    {pilotos.map(p => (<option key={p.id_piloto} value={p.id_piloto}>{p.nombre} {p.apellido}</option>))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="id_bus" className="form-label">Bus</label>
                  <select className="form-select" name="id_bus" value={formData.id_bus} onChange={handleInputChange} required>
                    <option value="">Seleccione un bus</option>
                    {buses.map(b => (<option key={b.id_bus} value={b.id_bus}>{b.placa}</option>))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="fecha_turno" className="form-label">Fecha y Hora del Turno</label>
                  <input type="datetime-local" className="form-control" name="fecha_turno" value={formData.fecha_turno} onChange={handleInputChange} required />
                </div>
                {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Asignar Turno</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignacionesPilotos;