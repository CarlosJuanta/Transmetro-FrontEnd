import apiClient from '../api';

const getAllUsuarios = async () => {
  try {
    const response = await apiClient.get('/usuarios');
    return response.data;
  } catch (error) { throw error; }
};

const createUsuario = async (userData) => {
  try {
    const response = await apiClient.post('/usuarios', userData);
    return response.data;
  } catch (error) { throw error; }
};

const updateUsuario = async (id, userData) => {
  try {
    const response = await apiClient.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) { throw error; }
};

const resetPassword = async (id, nuevaContrasenia) => {
    try {
        const response = await apiClient.put(`/usuarios/${id}/reset-password`, { nuevaContrasenia });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteUsuario = async (id) => {
  try {
    await apiClient.delete(`/usuarios/${id}`);
  } catch (error) { throw error; }
};

export {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  resetPassword,
  deleteUsuario
};