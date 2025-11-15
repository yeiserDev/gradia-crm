import axios from 'axios';

const STUDENT_API_URL = process.env.NEXT_PUBLIC_STUDENT_API_URL; // "http://localhost:3001/api/student"

// 🔑 Clave para obtener el token de localStorage
const ACCESS_TOKEN_KEY = 'gradia_access_token';

export const axiosStudent = axios.create({
  baseURL: STUDENT_API_URL,
  withCredentials: true,
});

// 🔑 INTERCEPTOR: Agrega el token automáticamente a cada request
axiosStudent.interceptors.request.use((config) => {
  // Obtener el token guardado en localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

  // Si existe el token, agregarlo al header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
