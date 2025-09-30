import React, { useState, useEffect } from 'react';
import { getAllPilotos, createPiloto, updatePiloto, deletePiloto, getPilotoById } from '../../../services/admin/piloto.service';

const initialFormState = {
  id_piloto: null,
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  dpi: '',
  direccion_residencia: '',
  telefono_celular: ''
};

const initialEscolaridadState = [{ grado_academico: '', institucion_academica: '', anio_finalizacion: '' }];

const Pilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [escolaridad, setEscolaridad] = useState(initialEscolaridadState);
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchPilotos = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPilotos();
        setPilotos(data);
      } catch (err) {
        setError('No se pudieron cargar los pilotos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPilotos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEscolaridadChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...escolaridad];
    list[index][name] = value;
    setEscolaridad(list);
  };

  const handleAddEscolaridad = () => {
    setEscolaridad([...escolaridad, { grado_academico: '', institucion_academica: '', anio_finalizacion: '' }]);
  };
  
  const handleRemoveEscolaridad = (index) => {
    const list = [...escolaridad];
    list.splice(index, 1);
    setEscolaridad(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const pilotoData = { ...formData, escolaridad: escolaridad.filter(e => e.grado_academico.trim() !== '') };
    
    try {
      if (isEditMode) {
        await updatePiloto(pilotoData.id_piloto, pilotoData);
        setPilotos(pilotos.map(p => p.id_piloto === pilotoData.id_piloto ? { ...p, ...pilotoData } : p));
      } else {
        const nuevoPiloto = await createPiloto(pilotoData);
        setPilotos([...pilotos, nuevoPiloto]);
      }
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el piloto.`;
      setFormError(message);
    }
  };
  
  const handleEdit = async (piloto) => {
    setIsEditMode(true);
    setFormError(null);
    try {
        const pilotoCompleto = await getPilotoById(piloto.id_piloto);
        setFormData({
            id_piloto: pilotoCompleto.id_piloto,
            nombre: pilotoCompleto.nombre,
            apellido: pilotoCompleto.apellido,
            fecha_nacimiento: pilotoCompleto.fecha_nacimiento.split('T')[0],
            dpi: pilotoCompleto.dpi,
            direccion_residencia: pilotoCompleto.direccion_residencia,
            telefono_celular: pilotoCompleto.telefono_celular
        });
        setEscolaridad(pilotoCompleto.escolaridad.length > 0 ? pilotoCompleto.escolaridad : initialEscolaridadState);
    } catch (err) {
        alert('Error al cargar los datos del piloto para editar.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este piloto?')) {
        try {
            await deletePiloto(id);
            setPilotos(pilotos.filter(p => p.id_piloto !== id));
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar el piloto.';
            alert(message);
        }
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setFormError(null);
    setFormData(initialFormState);
    setEscolaridad(initialEscolaridadState);
  };

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <h2>Lista de Pilotos</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>DPI</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pilotos.map((piloto) => (
                  <tr key={piloto.id_piloto}>
                    <td>{piloto.nombre} {piloto.apellido}</td>
                    <td>{piloto.dpi}</td>
                    <td>{piloto.telefono_celular}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(piloto)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(piloto.id_piloto)}>Eliminar</button>
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
              <h5 className="card-title">{isEditMode ? 'Editar Piloto' : 'Nuevo Piloto'}</h5>
              <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-2" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required />
                <input type="text" className="form-control mb-2" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Apellido" required />
                <input type="date" className="form-control mb-2" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} required />
                <input type="text" className="form-control mb-2" name="dpi" value={formData.dpi} onChange={handleInputChange} placeholder="DPI" required />
                <input type="text" className="form-control mb-2" name="telefono_celular" value={formData.telefono_celular} onChange={handleInputChange} placeholder="Teléfono" required />
                <textarea className="form-control mb-2" name="direccion_residencia" value={formData.direccion_residencia} onChange={handleInputChange} placeholder="Dirección" required />
                
                <hr />
                <h6>Escolaridad</h6>
                {escolaridad.map((item, index) => (
                    <div key={index} className="border p-2 mb-2 rounded">
                        <input type="text" className="form-control form-control-sm mb-1" name="grado_academico" value={item.grado_academico} onChange={e => handleEscolaridadChange(index, e)} placeholder="Grado Académico" />
                        <input type="text" className="form-control form-control-sm mb-1" name="institucion_academica" value={item.institucion_academica} onChange={e => handleEscolaridadChange(index, e)} placeholder="Institución" />
                        <input type="number" className="form-control form-control-sm mb-1" name="anio_finalizacion" value={item.anio_finalizacion} onChange={e => handleEscolaridadChange(index, e)} placeholder="Año Finalización" />
                        {escolaridad.length > 1 && <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => handleRemoveEscolaridad(index)}>Quitar</button>}
                    </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-success w-100 mb-3" onClick={handleAddEscolaridad}>Añadir Grado</button>
                
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

export default Pilotos;