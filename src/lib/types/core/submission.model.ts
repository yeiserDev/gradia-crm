// src/lib/types/core/submission.model.ts

/**
 * El objeto que el componente 'TaskSubmissionBox'
 * espera recibir en su prop 'onSubmitted'.
 */
export interface TaskSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  files: { name: string; size: number }[];
  grade: number | string | null;
  feedback: string | null;
  status: 'SUBMITTED' | 'GRADED' | 'NOT_SUBMITTED';
}

/**
 * El objeto que nuestro servicio simulado
 * 'submitTask' devolverá.
 */
export interface ApiSubmissionResponse {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  attachments?: { title: string }[];
}

export type AttachmentType = 'pdf' | 'document' | 'slide' | 'video' | 'link';

/**
 * Un archivo adjunto en una entrega (el viejo tipo 'Attach')
 */
export interface Attach {
  id: string;
  type: AttachmentType;
  title: string;
  url: string; // Para el enlace "Abrir"
}

/**
 * Representa la entrega de un estudiante (el viejo tipo 'Submission')
 * que se usa en el modal de calificación.
 */
export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string | null;
  grade: number | string | null;
  feedback: string | null;
  attachments?: Attach[];
  
  // --- ¡AÑADE ESTA LÍNEA! ---
  avatarUrl?: string; // Para la lista de estudiantes
  
  // --- ¡ASEGÚRATE DE QUE 'status' ESTÉ ASÍ! ---
  status: 'SUBMITTED' | 'GRADED' | 'NOT_SUBMITTED';
}
