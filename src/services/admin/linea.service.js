import apiClient from '../api';

const getAllLineas = async () => {
  try {
    const response = await apiClient.get('/lineas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLineaById = async (id) => {
    try {
        const response = await apiClient.get(`/lineas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createLinea = async (lineaData) => {
  try {
    const response = await apiClient.post('/lineas', lineaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateLinea = async (id, lineaData) => {
  try {
    const response = await apiClient.put(`/lineas/${id}`, lineaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteLinea = async (id) => {
  try {
    const response = await apiClient.delete(`/lineas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateRutaDeLinea = async (id, rutaData) => {
    try {
        const response = await apiClient.put(`/lineas/${id}/ruta`, { ruta: rutaData });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
  getAllLineas,
  getLineaById,
  createLinea,
  updateLinea,
  deleteLinea,
  updateRutaDeLinea
};