import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Only add Authorization header for protected endpoints
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  
  getById: (id) => api.get(`/employee/${id}`),
  
  create: (employee) => api.post('/employee', employee),
  
  update: (id, employee) => api.patch(`/employee/${id}`, employee),
  
  delete: (id) => api.delete(`/employee/${id}`),
};

export default api;
