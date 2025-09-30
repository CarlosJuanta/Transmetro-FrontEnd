import apiClient from '../api';

const getAllPilotos = async () => {
  try {
    const response = await apiClient.get('/pilotos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPilotoById = async (id) => {
    try {
        const response = await apiClient.get(`/pilotos/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createPiloto = async (pilotoData) => {
  try {
    const response = await apiClient.post('/pilotos', pilotoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePiloto = async (id, pilotoData) => {
  try {
    const response = await apiClient.put(`/pilotos/${id}`, pilotoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deletePiloto = async (id) => {
  try {
    const response = await apiClient.delete(`/pilotos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllPilotos,
  getPilotoById,
  createPiloto,
  updatePiloto,
  deletePiloto
};