// src/lib/types/core/task.model.ts

/**
 * Resumen de una tarea para el dashboard.
 */
export interface TaskSummary {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  dueAt: string;
}

// --- AÑADE ESTA NUEVA INTERFACE ---
/**
 * Representa un comentario en una tarea.
 * Basado en el componente TaskComments.
 */
export interface TaskComment {
  id: string;
  authorName: string;
  createdAt: string; // Un ISO string (ej. new Date().toISOString())
  body: string;
  parentId: string | null; // Para anidar respuestas
}

// --- AÑADE ESTA NUEVA INTERFACE ---
/**
 * Representa los detalles completos de una tarea 
 * (para el formulario de edición).
 */
export interface TaskDetail {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | null; // ISO string
  unitId?: string; // 👈 AÑADIR ESTO
}
