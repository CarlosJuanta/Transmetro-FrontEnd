import apiClient from '../api';

const getAllRoles = async () => {
  try {
    const response = await apiClient.get('/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createRol = async (tipo_rol) => {
  try {
    const response = await apiClient.post('/roles', { tipo_rol });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateRol = async (id, tipo_rol) => {
  try {
    const response = await apiClient.put(`/roles/${id}`, { tipo_rol });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteRol = async (id) => {
  try {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllRoles,
  createRol,
  updateRol,
  deleteRol
};