import apiClient from '../api';

const getAllAsignacionesGuardia = async () => {
  try {
    const response = await apiClient.get('/asignaciones-guardias');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createAsignacionGuardia = async (asignacionData) => {
  try {
    const response = await apiClient.post('/asignaciones-guardias', asignacionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteAsignacionGuardia = async (id) => {
  try {
    await apiClient.delete(`/asignaciones-guardias/${id}`);
  } catch (error) {
    throw error;
  }
};

const getAllAsignacionesPiloto = async () => {
    try {
      const response = await apiClient.get('/asignaciones-pilotos');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  const createAsignacionPiloto = async (asignacionData) => {
    try {
      const response = await apiClient.post('/asignaciones-pilotos', asignacionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteAsignacionPiloto = async (id) => {
    try {
      await apiClient.delete(`/asignaciones-pilotos/${id}`);
    } catch (error) {
      throw error;
    }
  };

export {
  getAllAsignacionesGuardia,
  createAsignacionGuardia,
  deleteAsignacionGuardia,
  getAllAsignacionesPiloto,
  createAsignacionPiloto,
  deleteAsignacionPiloto
};