import apiClient from '../api';

const getAllDepartamentos = async () => {
  try {
    const response = await apiClient.get('/departamentos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createDepartamento = async (nombre) => {
  try {
    const response = await apiClient.post('/departamentos', { nombre });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateDepartamento = async (id, nombre) => {
    try {
        const response = await apiClient.put(`/departamentos/${id}`, { nombre });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteDepartamento = async (id) => {
    try {
        await apiClient.delete(`/departamentos/${id}`);
    } catch (error) {
        throw error;
    }
};

export { 
    getAllDepartamentos, 
    createDepartamento,
    updateDepartamento,
    deleteDepartamento
};