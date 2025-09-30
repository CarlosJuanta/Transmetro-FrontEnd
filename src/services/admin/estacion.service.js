import apiClient from '../api';

const getAllEstaciones = async () => {
  try {
    const response = await apiClient.get('/estaciones');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getEstacionById = async (id) => {
    try {
        const response = await apiClient.get(`/estaciones/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createEstacion = async (estacionData) => {
  try {
    const response = await apiClient.post('/estaciones', estacionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateEstacion = async (id, estacionData) => {
  try {
    const response = await apiClient.put(`/estaciones/${id}`, estacionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteEstacion = async (id) => {
  try {
    const response = await apiClient.delete(`/estaciones/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createAcceso = async (idEstacion, nombre) => {
    try {
        const response = await apiClient.post(`/estaciones/${idEstacion}/accesos`, { nombre });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteAcceso = async (idAcceso) => {
    try {
        await apiClient.delete(`/estaciones/accesos/${idAcceso}`);
    } catch (error) {
        throw error;
    }
};

const createParqueo = async (idEstacion, nombre) => {
    try {
        const response = await apiClient.post(`/estaciones/${idEstacion}/parqueos`, { nombre });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteParqueo = async (idParqueo) => {
    try {
        await apiClient.delete(`/estaciones/parqueos/${idParqueo}`);
    } catch (error) {
        throw error;
    }
};

export {
  getAllEstaciones,
  getEstacionById,
  createEstacion,
  updateEstacion,
  deleteEstacion,
  createAcceso,
  deleteAcceso,
  createParqueo,
  deleteParqueo
};