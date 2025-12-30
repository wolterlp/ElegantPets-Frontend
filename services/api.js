import axios from 'axios';

// Replace with actual backend URL
const API_URL = 'http://localhost:8000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding token if needed (placeholder)
api.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'Ocurrió un error inesperado.';
        
        if (error.response) {
            // Server responded with a status code other than 2xx
            if (error.response.status === 500) {
                message = 'Error del Servidor: Es posible que la base de datos no esté activa.';
            } else if (error.response.status === 404) {
                message = 'Recurso no encontrado (404).';
            } else {
                message = error.response.data?.message || 'Error en la petición.';
            }
        } else if (error.request) {
            // Request made but no response (Network Error)
            message = 'No se pudo conectar con el servidor backend. Verifique que esté encendido.';
        } else {
            message = error.message;
        }

        // Optional: Show Alert directly here, or just attach to error object
        // import { Alert } from 'react-native'; 
        // Alert.alert('Error de Conexión', message);

        // We reject with the formatted message so individual screens can display it
        return Promise.reject(new Error(message));
    }
);

export const patientsApi = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const clinicalHistoryApi = {
    getAll: () => api.get('/clinical-history'),
    getByPatientId: (patientId) => api.get(`/clinical-history/patient/${patientId}`),
    create: (data) => api.post('/clinical-history', data),
};

export const usersApi = {
    getAll: () => api.get('/users'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Add other services as needed

export default api;
