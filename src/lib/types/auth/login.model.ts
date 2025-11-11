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
 * (Recuerda que los tokens viajan por cookies HttpOnly, no en este JSON)
 */
export interface LoginResponse {
  message: string; // Ej: "Login exitoso"
}