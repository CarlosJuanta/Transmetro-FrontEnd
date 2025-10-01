import apiClient from '../api';

const getReporteEstaciones = async (params = {}) => {
    try {
        const response = await apiClient.get('/reportes/estaciones', { params });
        return response.data;
    } catch (error) { throw error; }
};

const getReporteLineasConBuses = async () => {
    try {
        const response = await apiClient.get('/reportes/lineas-buses');
        return response.data;
    } catch (error) { throw error; }
};

const getReporteDistanciaLinea = async (id_linea) => {
    try {
        const response = await apiClient.get(`/reportes/lineas/${id_linea}/distancia`);
        return response.data;
    } catch (error) { throw error; }
};

const getReporteAccesosPorLinea = async (id_linea) => {
    try {
        const response = await apiClient.get(`/reportes/lineas/${id_linea}/accesos`);
        return response.data;
    } catch (error) { throw error; }
};

const getReporteLineasConEstaciones = async () => {
    try {
        const response = await apiClient.get('/reportes/lineas-estaciones');
        return response.data;
    } catch (error) { throw error; }
};

const getReporteEstadoLineas = async () => {
    try {
        const response = await apiClient.get('/reportes/estado-lineas');
        return response.data;
    } catch (error) { throw error; }
};

export {
    getReporteEstaciones,
    getReporteLineasConBuses,
    getReporteDistanciaLinea,
    getReporteAccesosPorLinea,
    getReporteLineasConEstaciones,
    getReporteEstadoLineas
};