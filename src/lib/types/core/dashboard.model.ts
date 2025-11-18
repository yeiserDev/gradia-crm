// src/lib/types/core/dashboard.model.ts

/**
 * Representa un punto de dato para el gráfico de 
 * evolución de notas.
 */
export interface GradePoint {
  date: string; // Un ISO string (ej. new Date().toISOString())
  score: number; // La nota (ej. 15)
  label?: string; 
}

// --- AÑADE ESTA NUEVA INTERFACE ---
/**
 * Representa un evento en la agenda del dashboard.
 */
export interface AgendaItem {
  id: string;
  type: 'Tarea' | 'Examen' | 'Evento'; // Tipo de evento
  title: string;
  when: string; // Un ISO string (ej. new Date().toISOString())
  location?: string; // Opcional
}