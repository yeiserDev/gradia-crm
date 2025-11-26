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

    // Crear FormData con el archivo y el ID de actividad
    const formData = new FormData();
    formData.append('id_actividad', taskId);

    // El backend espera UN solo archivo con el nombre 'archivo'
    if (files.length > 0) {
      formData.append('archivo', files[0]); // Solo el primer archivo
    }

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
      attachments: (data.data.archivos || []).map((archivo: { nombre_archivo: string }) => ({
        title: archivo.nombre_archivo
      }))
    };

    return submission;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error('❌ Error al entregar tarea:', error);
    throw new Error(err.response?.data?.message || err.message || 'Error al entregar la tarea');
  }
};
