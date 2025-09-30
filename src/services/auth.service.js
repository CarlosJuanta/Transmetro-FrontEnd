import apiClient from './api';

const loginService = async (correo, contrasenia) => {
  try {
    const response = await apiClient.post('/auth/login', {
      correo,
      contrasenia,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { loginService };