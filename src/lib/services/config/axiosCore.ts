import axios from 'axios';

// 1. Obtenemos la URL de tu backend de Core (definida en .env)
const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL; // Ej: 'http://localhost:8081/api/v1'

export const axiosCore = axios.create({
  baseURL: CORE_API_URL,

  /**
   * 2. ¡LA MISMA LÍNEA MÁGICA! 🔑
   * Esto asegura que la cookie 'accessToken' (creada por Auth)
   * también se envíe a tu microservicio de Core.
   */
  withCredentials: true,
});