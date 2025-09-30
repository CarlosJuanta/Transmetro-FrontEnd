import apiClient from '../api';

const registrarLlegada = async (llegadaData) => {
    try {
        const response = await apiClient.post('/operaciones/llegada', llegadaData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const registrarSalida = async (idRegistro) => {
    try {
        const response = await apiClient.patch(`/operaciones/registros/${idRegistro}/salida`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    registrarLlegada,
    registrarSalida,
};