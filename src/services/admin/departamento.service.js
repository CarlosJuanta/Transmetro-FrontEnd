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

export { getAllDepartamentos, createDepartamento };