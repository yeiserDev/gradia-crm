import type { Role } from './role.model';

/**
 * Representa el objeto 'user' adaptado que se pasa
 * a los componentes de la UI (como los Tabs).
 * Es un HÍBRIDO de los datos de Auth y (eventualmente) Persona.
 */
export interface UiUser {
  id: number; // O string, dependiendo de tu BD
  name: string;
  email: string;
  role: Role; // 'DOCENTE', 'ESTUDIANTE', 'ADMIN'
  org?: string;
  avatarUrl?: string | null;
}