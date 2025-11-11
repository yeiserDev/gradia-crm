import { Submission } from '@/lib/types/core/submission.model';
import { axiosCore } from '../config/axiosCore';

// --- BASE DE DATOS SIMULADA (Temporal) ---
let MOCK_SUBMISSIONS_DB: Submission[] = [
  {
    id: 'sub-1',
    studentId: 'user-123',
    studentName: 'Ana García (Simulada)',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // hace 2 horas
    grade: null,
    feedback: null,
    status: 'SUBMITTED',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Ana&backgroundColor=b6e3f4',
    attachments: [
      { id: 'att-1', type: 'pdf', title: 'Ensayo_Final.pdf', url: '#' },
    ]
  },
  {
    id: 'sub-2',
    studentId: 'user-456',
    studentName: 'Bruno Diaz (Simulado)',
    submittedAt: null, // No entregó
    grade: null,
    feedback: null,
    status: 'NOT_SUBMITTED',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Bruno&backgroundColor=c0aede',
    attachments: []
  },
  {
    id: 'sub-3',
    studentId: 'user-789',
    studentName: 'Carla Torres (Simulada)',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // ayer
    grade: 18,
    feedback: '¡Excelente trabajo!',
    status: 'GRADED',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Carla&backgroundColor=d1d4f9',
    attachments: [
      { id: 'att-2', type: 'link', title: 'video-demo.com', url: '#' },
    ]
  },
];
// --- FIN DE MOCK DB ---

/**
 * (SIMULADO) Obtiene la lista de entregas para una tarea.
 * Reemplaza a listForTeacher
 */
export const getSubmissionsList = async (taskId: string): Promise<Submission[]> => {
  console.log(`Simulando fetch de entregas para tarea: ${taskId}`);
  await new Promise(r => setTimeout(r, 600)); // Simula red
  
  // En una app real, harías:
  // const { data } = await axiosCore.get(`/tasks/${taskId}/submissions`);
  // return data;
  
  return MOCK_SUBMISSIONS_DB;
};

/**
 * (SIMULADO) Guarda la nota y feedback de una entrega.
 * Reemplaza a upsertGrade
 */
export const saveGrade = async (
  submissionId: string, 
  grade?: number, 
  feedback?: string
): Promise<Submission> => {
  console.log(`Simulando guardado de nota para: ${submissionId}`);
  await new Promise(r => setTimeout(r, 500)); // Simula red

  // Actualiza la DB simulada
  let updatedSubmission: Submission | undefined;
  MOCK_SUBMISSIONS_DB = MOCK_SUBMISSIONS_DB.map(s => {
    if (s.id === submissionId) {
      updatedSubmission = { 
        ...s, 
        grade: grade ?? null, 
        feedback: feedback ?? null,
        status: (grade != null) ? 'GRADED' : 'SUBMITTED' // Si hay nota, está calificado
      };
      return updatedSubmission;
    }
    return s;
  });

  if (!updatedSubmission) throw new Error("Submission no encontrada");

  // En una app real, harías:
  // const { data } = await axiosCore.post(`/submissions/${submissionId}/grade`, { grade, feedback });
  // return data;
  
  return updatedSubmission;
};