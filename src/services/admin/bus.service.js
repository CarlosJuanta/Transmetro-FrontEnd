import apiClient from '../api';

const getAllBuses = async () => {
  try {
    const response = await apiClient.get('/buses');
    return response.data;
  } catch (error) { throw error; }
};

const createBus = async (busData) => {
  try {
    const response = await apiClient.post('/buses', busData);
    return response.data;
  } catch (error) { throw error; }
};

const updateBus = async (id, busData) => {
  try {
    const response = await apiClient.put(`/buses/${id}`, busData);
    return response.data;
  } catch (error) { throw error; }
};

const deleteBus = async (id) => {
  try {
    const response = await apiClient.delete(`/buses/${id}`);
    return response.data;
  } catch (error) { throw error; }
};

const getAllParqueos = async () => {
  try {
    const response = await apiClient.get('/parqueos');
    return response.data;
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