/**
 * Representa al usuario autenticado en el sistema.
 * Basado en la respuesta del caso de uso 'getMyProfile.js'
 */
export interface User {
  id_usuario: number;
  correo_institucional: string;
  roles: string[]; // Ej: ['ADMIN', 'ESTUDIANTE']
  nombre: string;
  apellido: string;
}