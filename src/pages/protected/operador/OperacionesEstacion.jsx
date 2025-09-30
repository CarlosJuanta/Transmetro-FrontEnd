import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { getAllBuses } from '../../../services/admin/bus.service';
import { registrarLlegada } from '../../../services/operador/operacion.service';

const OperacionesEstacion = () => {
  const { usuario } = useAuth();
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [idBusSeleccionado, setIdBusSeleccionado] = useState('');
  const [pasajeros, setPasajeros] = useState('');
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      setIsLoading(true);
      try {
        const busesData = await getAllBuses();
        setBuses(busesData);
      } catch (err) {
        setError('No se pudieron cargar los buses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    
    if (!idBusSeleccionado || !pasajeros) {
        setFormError('Debe seleccionar un bus y registrar el número de pasajeros.');
        return;
    }

    const llegadaData = {
        id_bus: parseInt(idBusSeleccionado, 10),
        id_estacion: usuario.id_estacion,
        pasajeros_registrados: parseInt(pasajeros, 10)
    };
    
    try {
        const resultado = await registrarLlegada(llegadaData);
        let message = `Llegada del bus registrada con éxito (ID de Registro: ${resultado.id_registro}).`;
        if (resultado.alerta) {
            message += ` ALERTA GENERADA: ${resultado.alerta.tipo}.`;
        }
        setSuccessMessage(message);
        setIdBusSeleccionado('');
        setPasajeros('');
    } catch (err) {
        const message = err.response?.data?.message || 'Error al registrar la llegada.';
        setFormError(message);
    }
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3>Registro de Operaciones de Estación</h3>
              <p className="text-muted">Estás operando en la estación ID: {usuario?.id_estacion || 'No asignada'}</p>
            </div>
            <div className="card-body">
              <h5 className="card-title">Registrar Llegada de Bus</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="id_bus" className="form-label">Seleccionar Bus</label>
                  <select 
                    className="form-select" 
                    id="id_bus"
                    value={idBusSeleccionado}
                    onChange={(e) => setIdBusSeleccionado(e.target.value)}
                    required
                  >
                    <option value="">Seleccione la placa de un bus...</option>
                    {buses.map(bus => (
                      <option key={bus.id_bus} value={bus.id_bus}>
                        {bus.placa} ({bus.nombre_linea || 'Sin Línea'})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="pasajeros" className="form-label">Número de Pasajeros Registrados</label>
                  <input 
                    type="number" 
                    className="form-control"
                    id="pasajeros"
                    value={pasajeros}
                    onChange={(e) => setPasajeros(e.target.value)}
                    placeholder="Ej: 25"
                    min="0"
                    required
                  />
                </div>
                
                {formError && <div className="alert alert-danger mt-3">{formError}</div>}
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Registrar Llegada
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperacionesEstacion;