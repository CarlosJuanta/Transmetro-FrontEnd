import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLineaById, updateRutaDeLinea } from '../../../services/admin/linea.service';
import { getAllEstaciones } from '../../../services/admin/estacion.service';

const LineaDetalle = () => {
  const { id_linea } = useParams();
  const [linea, setLinea] = useState(null);
  const [rutaActual, setRutaActual] = useState([]);
  const [estacionesDisponibles, setEstacionesDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [lineaData, estacionesData] = await Promise.all([
          getLineaById(id_linea),
          getAllEstaciones()
        ]);
        
        setLinea(lineaData);
        
        const rutaConNombres = lineaData.ruta ? lineaData.ruta.map(parada => ({
            ...parada,
            nombre_estacion: estacionesData.find(e => e.id_estacion === parada.id_estacion)?.nombre || 'Desconocida'
        })) : [];
        setRutaActual(rutaConNombres);
        
        const estacionesEnRutaIds = new Set(rutaConNombres.map(r => r.id_estacion));
        setEstacionesDisponibles(estacionesData.filter(e => !estacionesEnRutaIds.has(e.id_estacion)));
        
      } catch (err) {
        setError('No se pudieron cargar los datos de la línea.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id_linea]);

  const handleAddEstacion = (estacion) => {
    const nuevaParada = { ...estacion, nombre_estacion: estacion.nombre };
    setRutaActual([...rutaActual, nuevaParada]);
    setEstacionesDisponibles(estacionesDisponibles.filter(e => e.id_estacion !== estacion.id_estacion));
  };

  const handleRemoveEstacion = (parada) => {
    const estacionOriginal = { ...parada, nombre: parada.nombre_estacion };
    delete estacionOriginal.nombre_estacion;
    
    setEstacionesDisponibles([...estacionesDisponibles, estacionOriginal]);
    setRutaActual(rutaActual.filter(r => r.id_estacion !== parada.id_estacion));
  };

  const moveEstacion = (index, direction) => {
    const newRuta = [...rutaActual];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newRuta.length) return;
    
    const temp = newRuta[index];
    newRuta[index] = newRuta[targetIndex];
    newRuta[targetIndex] = temp;
    
    setRutaActual(newRuta);
  };

  const handleGuardarRuta = async () => {
    const rutaParaGuardar = rutaActual.map((parada, index) => ({
        id_estacion: parada.id_estacion,
        numero_parada: index + 1,
        distancia_siguiente_parada: parada.distancia_siguiente_parada || 0
    }));
    
    try {
        await updateRutaDeLinea(id_linea, rutaParaGuardar);
        alert('Ruta guardada exitosamente.');
    } catch (err) {
        alert('Error al guardar la ruta.');
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <Link to="/lineas" className="btn btn-secondary mb-3">Volver a Líneas</Link>
      <h2>Gestionar Ruta de la Línea: {linea?.nombre}</h2>
      <p>Usa los botones para construir y ordenar la ruta.</p>

      <div className="row">
        <div className="col-md-6">
          <h4>Ruta Actual ({rutaActual.length} paradas)</h4>
          <ul className="list-group">
            {rutaActual.map((parada, index) => (
              <li key={parada.id_estacion} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{index + 1}. {parada.nombre_estacion || parada.nombre}</span>
                <div>
                  <button className="btn btn-sm btn-light me-1" onClick={() => moveEstacion(index, -1)} disabled={index === 0}>↑</button>
                  <button className="btn btn-sm btn-light me-1" onClick={() => moveEstacion(index, 1)} disabled={index === rutaActual.length - 1}>↓</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemoveEstacion(parada)}>X</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Estaciones Disponibles ({estacionesDisponibles.length})</h4>
          <ul className="list-group">
            {estacionesDisponibles.map((estacion) => (
              <li key={estacion.id_estacion} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{estacion.nombre}</span>
                <button className="btn btn-sm btn-success" onClick={() => handleAddEstacion(estacion)}>+</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={handleGuardarRuta}>Guardar Cambios en la Ruta</button>
      </div>
    </div>
  );
};

export default LineaDetalle;