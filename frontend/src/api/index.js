import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getMenuItems = () => API.get('menu/');
export const createOrder = (order) => API.post('orders/', order);
export const getOrders = () => API.get('orders/');
export const updateOrder = (id, order) => API.put(`orders/${id}/`, order);
export const getAnalytics = (params) => API.get('orders/analytics/', { params });
export const exportCSV = (params) => API.get('orders/export_csv/', { params, responseType: 'blob' });
export const generateAccessCode = () => API.post('access-codes/generate/');