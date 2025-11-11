/**
 * Payload (Body) para PUT /api/auth/password
 * (Cambiar contraseña estando logueado)
 * [cite: 975]
 */
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/**
 * Payload (Body) para POST /api/auth/forgot-password
 * [cite: 992]
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Payload (Body) para POST /api/auth/reset-password
 * [cite: 1013]
 */
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/**
 * Respuesta genérica para los endpoints de contraseña
 * (change, forgot, reset)
 * [cite: 984, 994, 1015]
 */
export interface PasswordResponse {
  message: string;
}