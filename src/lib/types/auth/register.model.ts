/**
 * Payload (Body) requerido por el endpoint POST /api/auth/register
 * Basado en 'registerPublicUser.js' [cite: 712]
 */
export interface RegisterCredentials {
  nombre: string;
  apellido: string;
  fecha_nacimiento?: string; // Es opcional en la BD [cite: 104]
  correo: string;
  password: string;
}

/**
 * Respuesta JSON del endpoint POST /api/auth/register
 * Basado en 'authController.js' [cite: 857-859]
 */     
export interface RegisterResponse {
  message: string; // Ej: "Usuario registrado correctamente"
  data: {
    id_usuario: number;
    correo: string;
  };
}