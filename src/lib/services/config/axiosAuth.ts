import axios from 'axios';

// 1. Obtenemos la URL de tu backend de Auth (definida en .env)
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;// Ej: 'http://localhost:8080/api/auth'

export const axiosAuth = axios.create({
  baseURL: AUTH_API_URL,

  /**
   * 2. ¡ESTA ES LA LÍNEA MÁGICA! 🔑
   * Le dice a Axios que debe enviar cualquier credencial 
   * (como las cookies HttpOnly) que el navegador tenga
   * para este dominio.
   */
  withCredentials: true, 
});