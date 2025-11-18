/**
 * Payload (Body) para POST /api/auth/admin/users
 * (Admin crea un nuevo usuario)
 * [cite: 472]
 */
export interface AdminCreateUserPayload {
  nombre: string;
  apellido: string;
  fecha_nacimiento?: string;
  correo: string;
  password: string;
  id_rol: number;
}

/**
 * Respuesta JSON del endpoint POST /api/auth/admin/users
 * [cite: 491, 870-872]
 */
export interface AdminCreateUserResponse {
  message: string; // Ej: "Usuario creado por ADMIN correctamente"
  data: {
    id_usuario: number;
    correo: string;
    roles: number[]; // Devuelve el array de IDs de rol [cite: 491]
  };
}