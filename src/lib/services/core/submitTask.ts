import { ApiSubmissionResponse } from '@/lib/types/core/submission.model';
import { axiosStudent } from '../config/axiosStudent';

interface SubmitTaskPayload {
  taskId: string;
  studentId: string;
  studentName: string;
  files: File[];
}

/**
 * Servicio para entregar una tarea con archivos adjuntos
 */
export const submitTask = async ({
  taskId,
  studentId,
  studentName,
  files
}: SubmitTaskPayload): Promise<ApiSubmissionResponse> => {

  try {
    console.log(`📤 Entregando tarea ${taskId} por ${studentName}...`);

    // Crear FormData con los archivos y el ID de actividad
    const formData = new FormData();
    formData.append('id_actividad', taskId);

    // Agregar cada archivo al FormData
    files.forEach(file => {
      formData.append('files', file);
    });

    // Enviar al backend
    const { data } = await axiosStudent.post('/entregas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!data.success) {
      throw new Error(data.message || 'Error al entregar tarea');
    }

    console.log('✅ Tarea entregada exitosamente:', data.data);

    // Mapear la respuesta del backend al formato esperado por el frontend
    const submission: ApiSubmissionResponse = {
      id: String(data.data.id_entrega),
      studentId: studentId,
      studentName: studentName,
      submittedAt: data.data.fecha_entrega || new Date().toISOString(),
      attachments: (data.data.archivos || []).map((archivo: any) => ({
        title: archivo.nombre_archivo
      }))
    };

    return submission;
  } catch (error: any) {
    console.error('❌ Error al entregar tarea:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al entregar la tarea');
  }
};
