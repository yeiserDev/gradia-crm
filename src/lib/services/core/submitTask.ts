import { ApiSubmissionResponse } from '@/lib/types/core/submission.model';
import { axiosCore } from '../config/axiosCore';

interface SubmitTaskPayload {
  taskId: string;
  studentId: string;
  studentName: string;
  files: File[];
}

/**
 * Esto es un servicio SIMULADO para entregar una tarea.
 * En el futuro, enviará los archivos al backend de Core.
 */
export const submitTask = async ({
  taskId, 
  studentId, 
  studentName, 
  files
}: SubmitTaskPayload): Promise<ApiSubmissionResponse> => {
  
  console.log(`Simulando entrega de tarea ${taskId} por ${studentName}...`);
  // Simulamos un retraso de red
  await new Promise(r => setTimeout(r, 1000)); 

  // En una app real, harías esto:
  // const formData = new FormData();
  // formData.append('taskId', taskId);
  // files.forEach(f => formData.append('files', f));
  // const { data } = await axiosCore.post('/submissions', formData);
  // return data;

  // Devolvemos una respuesta simulada
  const submission: ApiSubmissionResponse = {
    id: `sub-${Date.now()}`,
    studentId: studentId,
    studentName: studentName,
    submittedAt: new Date().toISOString(),
    attachments: files.map(f => ({ title: f.name }))
  };
  
  return submission;
};