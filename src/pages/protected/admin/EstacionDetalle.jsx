import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEstacionById, createAcceso, deleteAcceso, createParqueo, deleteParqueo } from '../../../services/admin/estacion.service';

const EstacionDetalle = () => {
  const { id_estacion } = useParams();
  const [estacion, setEstacion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombreAcceso, setNombreAcceso] = useState('');
  const [nombreParqueo, setNombreParqueo] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEstacionById(id_estacion);
      setEstacion(data);
    } catch (err) {
      setError('No se pudieron cargar los datos de la estación.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_estacion]);

  const handleCreateAcceso = async (e) => {
    e.preventDefault();
    if (!nombreAcceso.trim()) return;
    try {
        await createAcceso(id_estacion, nombreAcceso);
        setNombreAcceso('');
        fetchData();
    } catch (err) {
        alert('Error al crear el acceso.');
    }
  };

  const handleDeleteAcceso = async (idAcceso) => {
    if (window.confirm('¿Seguro que quieres eliminar este acceso?')) {
        try {
            await deleteAcceso(idAcceso);
            fetchData();
        } catch (err) {
            alert('Error al eliminar el acceso. Puede que tenga dependencias.');
        }
    }
  };
  
  const handleCreateParqueo = async (e) => {
    e.preventDefault();
    if (!nombreParqueo.trim()) return;
    try {
        await createParqueo(id_estacion, nombreParqueo);
        setNombreParqueo('');
        fetchData();
    } catch (err) {
        alert('Error al crear el parqueo.');
    }
  };
  
  const handleDeleteParqueo = async (idParqueo) => {
    if (window.confirm('¿Seguro que quieres eliminar este parqueo?')) {
        try {
            await deleteParqueo(idParqueo);
            fetchData();
        } catch (err) {
            alert('Error al eliminar el parqueo. Puede que tenga dependencias.');
        }
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <Link to="/estaciones" className="btn btn-secondary mb-3">Volver a Estaciones</Link>
      <h2>Estación: {estacion?.nombre}</h2>
      <p><strong>Municipalidad:</strong> {estacion?.nombre_municipalidad}</p>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <h4>Accesos</h4>
          <ul className="list-group mb-3">
            {estacion?.accesos.map(acceso => (
              <li key={acceso.id_acceso} className="list-group-item d-flex justify-content-between align-items-center">
                {acceso.nombre}
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAcceso(acceso.id_acceso)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCreateAcceso} className="d-flex">
            <input type="text" className="form-control me-2" value={nombreAcceso} onChange={e => setNombreAcceso(e.target.value)} placeholder="Nombre del nuevo acceso" required />
            <button type="submit" className="btn btn-primary">Añadir</button>
          </form>
        </div>

        <div className="col-md-6">
          <h4>Parqueos</h4>
          <ul className="list-group mb-3">
             {estacion?.parqueos.map(parqueo => (
              <li key={parqueo.id_parqueo} className="list-group-item d-flex justify-content-between align-items-center">
                {parqueo.nombre}
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteParqueo(parqueo.id_parqueo)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCreateParqueo} className="d-flex">
            <input type="text" className="form-control me-2" value={nombreParqueo} onChange={e => setNombreParqueo(e.target.value)} placeholder="Nombre del nuevo parqueo" required />
            <button type="submit" className="btn btn-primary">Añadir</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EstacionDetalle;