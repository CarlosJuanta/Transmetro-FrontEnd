import apiClient from '../api';

const getAllMunicipalidades = async () => {
  try {
    const response = await apiClient.get('/municipalidades');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMunicipalidadById = async (id) => {
    try {
        const response = await apiClient.get(`/municipalidades/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createMunicipalidad = async (nombre, id_departamento) => {
  try {
    const response = await apiClient.post('/municipalidades', { nombre, id_departamento });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateMunicipalidad = async (id, nombre, id_departamento) => {
    try {
        const response = await apiClient.put(`/municipalidades/${id}`, { nombre, id_departamento });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteMunicipalidad = async (id) => {
    try {
        const response = await apiClient.delete(`/municipalidades/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { 
    getAllMunicipalidades, 
    getMunicipalidadById,
    createMunicipalidad,
    updateMunicipalidad,
    deleteMunicipalidad
};