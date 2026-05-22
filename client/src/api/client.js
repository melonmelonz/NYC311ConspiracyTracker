import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export async function fetchReports(params = {}) {
  const response = await api.get('/reports', { params });
  return response.data;
}

export async function fetchStats() {
  const response = await api.get('/stats');
  return response.data;
}

export async function fetchMapData(params = {}) {
  const response = await api.get('/map-data', { params });
  return response.data;
}
