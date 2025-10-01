import React, { useState, useEffect } from 'react';
import { getAllAsignacionesGuardia, createAsignacionGuardia, deleteAsignacionGuardia } from '../../../services/operador/asignacion.service';
import { getAllPersonal } from '../../../services/admin/personal.service';
import { getEstacionById, getAllEstaciones } from '../../../services/admin/estacion.service';

const initialFormState = { id_personal: '', id_acceso: '', fecha_turno: '' };

const AsignacionesGuardias = () => {
  const [todasLasAsignaciones, setTodasLasAsignaciones] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [estacionesConAccesos, setEstacionesConAccesos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);

  const [filtroEstacion, setFiltroEstacion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [asigData, personalData, estacionesSimples] = await Promise.all([
          getAllAsignacionesGuardia(),
          getAllPersonal(),
          getAllEstaciones() 
        ]);

        const promesasEstacionesCompletas = estacionesSimples.map(est => getEstacionById(est.id_estacion));
        const estacionesCompletas = await Promise.all(promesasEstacionesCompletas);
        
        setTodasLasAsignaciones(asigData);
        setPersonal(personalData);
        setEstacionesConAccesos(estacionesCompletas);

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
    if (!formData.id_personal || !formData.id_acceso || !formData.fecha_turno) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const nuevaAsignacion = await createAsignacionGuardia(formData);
      setTodasLasAsignaciones([nuevaAsignacion, ...todasLasAsignaciones]);
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la asignación.';
      setFormError(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asignación?')) {
        try {
            await deleteAsignacionGuardia(id);
            setTodasLasAsignaciones(todasLasAsignaciones.filter(a => a.id_asignacion !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar la asignación.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const asignacionesFiltradas = filtroEstacion 
    ? todasLasAsignaciones.filter(a => String(a.id_estacion) === filtroEstacion)
    : todasLasAsignaciones;

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Historial de Asignaciones de Guardias</h2>
            <div className="w-50">
                <select 
                    className="form-select"
                    value={filtroEstacion}
                    onChange={e => setFiltroEstacion(e.target.value)}
                >
                    <option value="">Filtrar por Estación (Mostrar Todas)</option>
                    {estacionesConAccesos.map(est => (
                        <option key={est.id_estacion} value={est.id_estacion}>{est.nombre}</option>
                    ))}
                </select>
            </div>
          </div>
          <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Guardia</th>
                  <th>Acceso</th>
                  <th>Estación</th>
                  <th>Fecha y Hora del Turno</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignacionesFiltradas.map((a) => (
                  <tr key={a.id_asignacion}>
                    <td>{a.nombre_completo_personal}</td>
                    <td>{a.nombre_acceso}</td>
                    <td>{a.nombre_estacion}</td>
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
                  <label htmlFor="id_personal" className="form-label">Personal de Seguridad</label>
                  <select className="form-select" name="id_personal" value={formData.id_personal} onChange={handleInputChange} required>
                    <option value="">Seleccione un guardia</option>
                    {personal.map(p => (<option key={p.id_personal} value={p.id_personal}>{p.nombre} {p.apellido}</option>))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="id_acceso" className="form-label">Acceso</label>
                  <select className="form-select" name="id_acceso" value={formData.id_acceso} onChange={handleInputChange} required>
                    <option value="">Seleccione un acceso</option>
                    {estacionesConAccesos.map(est => (
                      <optgroup key={est.id_estacion} label={est.nombre}>
                        {est.accesos.map(acc => (
                          <option key={acc.id_acceso} value={acc.id_acceso}>{acc.nombre}</option>
                        ))}
                      </optgroup>
                    ))}
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

export default AsignacionesGuardias;