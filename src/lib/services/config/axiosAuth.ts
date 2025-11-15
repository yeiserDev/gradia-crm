import axios from 'axios';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL; // "http://localhost:8080/api/auth"

// 🔑 Clave para obtener el token de localStorage
const ACCESS_TOKEN_KEY = 'gradia_access_token';

export const axiosAuth = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
});

// 🔑 INTERCEPTOR: Agrega el token automáticamente a cada request
axiosAuth.interceptors.request.use((config) => {
  // Obtener el token guardado en localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

  // Si existe el token, agregarlo al header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
