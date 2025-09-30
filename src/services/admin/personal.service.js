import apiClient from '../api';

const getAllPersonal = async () => {
  try {
    const response = await apiClient.get('/personal-seguridad');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createPersonal = async (personalData) => {
  try {
    const response = await apiClient.post('/personal-seguridad', personalData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePersonal = async (id, personalData) => {
  try {
    const response = await apiClient.put(`/personal-seguridad/${id}`, personalData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deletePersonal = async (id) => {
  try {
    const response = await apiClient.delete(`/personal-seguridad/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllPersonal,
  createPersonal,
  updatePersonal,
  deletePersonal
};