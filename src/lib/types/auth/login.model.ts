/**
 * Payload (Body) requerido por el endpoint POST /api/auth/login
 * [cite: 881-882]
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta JSON del endpoint POST /api/auth/login
 * [cite: 901]
 * ✅ Ahora incluye accessToken en el response para guardarlo en localStorage
 */
export interface LoginResponse {
  message: string;
  accessToken: string;
}