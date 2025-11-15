import axios from 'axios';

const TEACHER_API_URL = process.env.NEXT_PUBLIC_TEACHER_API_URL; // "http://localhost:3002/api"

// 🔑 Clave para obtener el token de localStorage
const ACCESS_TOKEN_KEY = 'gradia_access_token';

export const axiosTeacher = axios.create({
  baseURL: TEACHER_API_URL,
  withCredentials: true,
});

// 🔑 INTERCEPTOR: Agrega el token automáticamente a cada request
axiosTeacher.interceptors.request.use((config) => {
  // Obtener el token guardado en localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

  // Si existe el token, agregarlo al header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
