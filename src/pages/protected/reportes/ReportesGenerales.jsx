import React, { useState, useEffect } from 'react';
import { 
    getReporteEstaciones, 
    getReporteLineasConBuses,
    getReporteDistanciaLinea,
    getReporteAccesosPorLinea,
    getReporteLineasConEstaciones
} from '../../../services/operador/reporte.service';
import { getAllMunicipalidades } from '../../../services/admin/municipalidad.service';
import { getAllLineas } from '../../../services/admin/linea.service';

const ReportesGenerales = () => {
  const [activeTab, setActiveTab] = useState('estaciones');
  
  const [reporteEstaciones, setReporteEstaciones] = useState([]);
  const [reporteLineasBuses, setReporteLineasBuses] = useState(null);
  const [reporteLineasEstaciones, setReporteLineasEstaciones] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [municipalidades, setMunicipalidades] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [filtros, setFiltros] = useState({ id_municipalidad: '', id_linea: '' });

  const [lineaSeleccionada, setLineaSeleccionada] = useState('');
  const [distanciaTotal, setDistanciaTotal] = useState(null);
  const [accesosPorLinea, setAccesosPorLinea] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [munisData, lineasData] = await Promise.all([
          getAllMunicipalidades(),
          getAllLineas()
        ]);
        setMunicipalidades(munisData);
        setLineas(lineasData);
      } catch (err) {
        setError('Error al cargar datos iniciales.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleGenerarReporteEstaciones = async () => {
    setError(null);
    try {
        const params = { id_municipalidad: filtros.id_municipalidad || undefined, id_linea: filtros.id_linea || undefined };
        const data = await getReporteEstaciones(params);
        setReporteEstaciones(data);
    } catch (err) { setError('Error al generar el reporte de estaciones.'); }
  };
  
  const handleGenerarReporteLineasBuses = async () => {
    setError(null);
    try {
        const data = await getReporteLineasConBuses();
        setReporteLineasBuses(data);
    } catch (err) { setError('Error al generar el reporte de líneas y buses.'); }
  };

  const handleGenerarReporteLineasEstaciones = async () => {
    setError(null);
    try {
        const data = await getReporteLineasConEstaciones();
        setReporteLineasEstaciones(data);
    } catch (err) { setError('Error al generar el reporte de estaciones por línea.'); }
  };

  const handleGenerarReportesDeLinea = async () => {
    if (!lineaSeleccionada) {
        setDistanciaTotal(null);
        setAccesosPorLinea([]);
        return;
    }
    setError(null);
    try {
        const [distanciaData, accesosData] = await Promise.all([ getReporteDistanciaLinea(lineaSeleccionada), getReporteAccesosPorLinea(lineaSeleccionada) ]);
        setDistanciaTotal(distanciaData.distancia_total_km);
        setAccesosPorLinea(accesosData);
    } catch (err) { setError('Error al generar los reportes de la línea.'); }
  };
  
  const renderContent = () => {
    if (isLoading) return <p>Cargando filtros...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    switch (activeTab) {
      case 'estaciones':
        return (
          <>
            <div className="row g-3 align-items-end mb-4">
              <div className="col-md-4"><label className="form-label">Filtrar por Municipalidad</label><select name="id_municipalidad" className="form-select" value={filtros.id_municipalidad} onChange={e => setFiltros({...filtros, id_municipalidad: e.target.value})}><option value="">Todas</option>{municipalidades.map(m => <option key={m.id_municipalidad} value={m.id_municipalidad}>{m.nombre}</option>)}</select></div>
              <div className="col-md-4"><label className="form-label">Filtrar por Línea</label><select name="id_linea" className="form-select" value={filtros.id_linea} onChange={e => setFiltros({...filtros, id_linea: e.target.value})}><option value="">Todas</option>{lineas.map(l => <option key={l.id_linea} value={l.id_linea}>{l.nombre}</option>)}</select></div>
              <div className="col-md-4"><button className="btn btn-primary w-100" onClick={handleGenerarReporteEstaciones}>Generar Reporte</button></div>
            </div>
            {reporteEstaciones.length > 0 && (
              <div className="table-responsive"><table className="table table-bordered"><thead><tr><th>Estación</th><th>Líneas y Buses</th></tr></thead><tbody>{reporteEstaciones.map(estacion => (<tr key={estacion.id_estacion}><td><strong>{estacion.nombre_estacion}</strong><br/><small className="text-muted">{estacion.nombre_municipalidad}</small></td><td>{estacion.lineas.map(linea => (<div key={linea.id_linea} className="mb-2"><strong>Línea: {linea.nombre_linea}</strong><ul>{linea.buses_asignados.map(bus => (<li key={bus.id_bus}>Bus Placa: {bus.placa}</li>))}{linea.buses_asignados.length === 0 && <li><small>Sin buses.</small></li>}</ul></div>))}{estacion.lineas.length === 0 && <small className="text-muted">Sin líneas.</small>}</td></tr>))}</tbody></table></div>
            )}
          </>
        );
      case 'lineasBuses':
        return (
          <>
            <button className="btn btn-primary mb-4" onClick={handleGenerarReporteLineasBuses}>Cargar Reporte de Líneas y Buses</button>
            {reporteLineasBuses && reporteLineasBuses.map(linea => (
                <div key={linea.id_linea} className="mb-3 border-bottom pb-2"><strong>{linea.nombre}</strong> ({linea.buses_asignados.length} buses)<ul>{linea.buses_asignados.map(bus => (<li key={bus.id_bus}>{bus.placa} (Capacidad: {bus.capacidad_maxima})</li>))}</ul></div>
            ))}
          </>
        );
      case 'lineasEstaciones':
        return (
          <>
            <button className="btn btn-primary mb-4" onClick={handleGenerarReporteLineasEstaciones}>Cargar Reporte de Estaciones por Línea</button>
            {reporteLineasEstaciones && reporteLineasEstaciones.map(linea => (
                <div key={linea.id_linea} className="mb-3 border-bottom pb-2">
                    <strong>{linea.nombre}</strong> ({linea.estaciones.length} estaciones)
                    <ol>{linea.estaciones.map(est => (<li key={est.numero_parada}>{est.nombre_estacion}</li>))}</ol>
                </div>
            ))}
          </>
        );
      case 'distancia':
         return (
          <>
            <div className="row g-3 align-items-end mb-4">
                <div className="col-md-8"><label className="form-label">Seleccione una Línea</label><select className="form-select" value={lineaSeleccionada} onChange={e => setLineaSeleccionada(e.target.value)}><option value="">Seleccione...</option>{lineas.map(l => <option key={l.id_linea} value={l.id_linea}>{l.nombre}</option>)}</select></div>
                <div className="col-md-4"><button className="btn btn-primary w-100" onClick={handleGenerarReportesDeLinea}>Calcular</button></div>
            </div>
            {distanciaTotal !== null && (
                <div className="mt-4"><h5>Resultados:</h5><p><strong>Distancia Total de la Ruta:</strong> {parseFloat(distanciaTotal).toFixed(2)} km</p><h6>Accesos en la Ruta:</h6><ul>{accesosPorLinea.map(acceso => (<li key={acceso.id_acceso}>{acceso.nombre_acceso} (en {acceso.nombre_estacion})</li>))}{accesosPorLinea.length === 0 && <li>Sin accesos definidos.</li>}</ul></div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h1>Reportes Generales</h1>
      <hr />
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'estaciones' ? 'active' : ''}`} onClick={() => setActiveTab('estaciones')}>Por Estación</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'lineasBuses' ? 'active' : ''}`} onClick={() => setActiveTab('lineasBuses')}>Líneas y Buses</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'lineasEstaciones' ? 'active' : ''}`} onClick={() => setActiveTab('lineasEstaciones')}>Estaciones por Línea</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'distancia' ? 'active' : ''}`} onClick={() => setActiveTab('distancia')}>Distancia de Línea</button></li>
      </ul>
      <div className="card"><div className="card-body">{renderContent()}</div></div>
    </div>
  );
};

export default ReportesGenerales;