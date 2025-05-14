import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMenuItems = () => API.get('menu/');
export const getCategories = () => API.get('categories/');
export const createOrder = (order) => API.post('orders/', order);
export const getOrders = () => API.get('orders/');
export const updateOrder = (id, order) => API.put(`orders/${id}/`, order);
export const getAnalytics = (params) => API.get('orders/analytics/', { params });
export const exportCSV = (params) => API.get('orders/export_csv/', { params, responseType: 'blob' });
export const generateAccessCode = () => API.post('access-codes/generate/');
export const login = (credentials) => API.post('auth/login/', credentials);