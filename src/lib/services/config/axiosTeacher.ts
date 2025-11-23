import axios from 'axios';

// 🔧 Asegurar que siempre tengamos un baseURL válido
const getTeacherApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_TEACHER_API_URL;
  
  // Si la URL del entorno es incorrecta (localhost:3000), forzar el valor correcto
  if (envUrl && envUrl.includes('localhost:3000')) {
    console.warn('⚠️ NEXT_PUBLIC_TEACHER_API_URL está configurada incorrectamente como localhost:3000. Corrigiendo a localhost:3002');
    return 'http://localhost:3002/api';
  }
  
  // Si está configurada correctamente, usarla
  if (envUrl && !envUrl.includes('localhost:3000')) {
    return envUrl;
  }
  
  // Si no está configurada, usar el valor por defecto
  if (typeof window !== 'undefined') {
    console.warn('⚠️ NEXT_PUBLIC_TEACHER_API_URL no está configurada. Usando valor por defecto: http://localhost:3002/api');
  }
  return 'http://localhost:3002/api';
};

const TEACHER_API_URL = getTeacherApiUrl();

// 🔑 Clave para obtener el token de localStorage
const ACCESS_TOKEN_KEY = 'gradia_access_token';

// Log de configuración (solo en cliente)
if (typeof window !== 'undefined') {
  console.log('🔧 axiosTeacher baseURL configurado:', TEACHER_API_URL);
}

export const axiosTeacher = axios.create({
  baseURL: TEACHER_API_URL,
  withCredentials: true,
});

// 🔒 Asegurar que el baseURL siempre esté configurado
if (!axiosTeacher.defaults.baseURL) {
  axiosTeacher.defaults.baseURL = TEACHER_API_URL;
  console.warn('⚠️ baseURL no estaba configurado, se estableció manualmente:', TEACHER_API_URL);
}

// 🔑 INTERCEPTOR: Agrega el token automáticamente a cada request
axiosTeacher.interceptors.request.use((config) => {
  // Obtener el token guardado en localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

  // Si existe el token, agregarlo al header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Debug: Log de la URL completa que se está usando
  if (typeof window !== 'undefined') {
    const baseURL = config.baseURL || axiosTeacher.defaults.baseURL || 'NO BASEURL';
    const fullUrl = baseURL && baseURL !== 'NO BASEURL' 
      ? `${baseURL}${config.url}` 
      : config.url;
    console.log(`🌐 axiosTeacher Request:`, {
      method: config.method?.toUpperCase(),
      baseURL: baseURL,
      url: config.url,
      fullUrl: fullUrl,
      defaultsBaseURL: axiosTeacher.defaults.baseURL
    });
  }

  return config;
});
