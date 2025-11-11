// src/lib/types/core/agenda.model.ts

/**
 * Representa un evento en el calendario/agenda.
 * (Basado en tu componente)
 */
export interface AgendaEvent {
  id: string;
  start: string; // ISO string
  end: string; // ISO string
  title: string;
  type: 'task' | 'event' | 'meeting'; // O los tipos que necesites
  description?: string;
}