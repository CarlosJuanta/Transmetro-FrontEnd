import apiClient from '../api';

const getAllBuses = async () => {
  try {
    const response = await apiClient.get('/buses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createBus = async (busData) => {
  try {
    const response = await apiClient.post('/buses', busData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBus = async (id, busData) => {
  try {
    const response = await apiClient.put(`/buses/${id}`, busData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteBus = async (id) => {
  try {
    const response = await apiClient.delete(`/buses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllParqueos = async () => {
    try {
        // Tu backend devuelve estaciones SIN parqueos anidados en este endpoint
        const estacionesResponse = await apiClient.get('/estaciones');
        const estaciones = estacionesResponse.data;

        // Creamos un array de promesas para obtener los parqueos de CADA estación
        const promesasDeParqueos = estaciones.map(estacion => 
            apiClient.get(`/estaciones/${estacion.id_estacion}/parqueos`)
        );
        
        // Esperamos a que todas las peticiones de parqueos se completen
        const respuestasDeParqueos = await Promise.all(promesasDeParqueos);

        // Aplanamos el resultado y lo enriquecemos con el nombre de la estación
        let todosLosParqueos = [];
        respuestasDeParqueos.forEach((respuesta, index) => {
            const parqueosDeEstacion = respuesta.data.map(parqueo => ({
                ...parqueo,
                nombre_estacion: estaciones[index].nombre
            }));
            todosLosParqueos = todosLosParqueos.concat(parqueosDeEstacion);
        });

        return todosLosParqueos;

    } catch (error) {
        throw error;
    }
};

export {
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getAllParqueos
};