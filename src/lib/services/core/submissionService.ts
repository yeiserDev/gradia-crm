import { Submission } from '@/lib/types/core/submission.model';
import { axiosStudent } from '../config/axiosStudent';

/**
 * Obtiene la lista de entregas del estudiante autenticado
 * Conectado al backend de Student: GET /api/student/entregas
 */
export const getSubmissionsList = async (taskId?: string): Promise<Submission[]> => {
  try {
    // 🔧 Llamada real al backend de Student
    const response = await axiosStudent.get('/entregas');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener entregas');
    }

    const entregasBackend = response.data.data || [];

    // Mapear entregas del backend al formato del frontend
    return entregasBackend
      .filter((entrega: any) => !taskId || entrega.actividad.id_actividad.toString() === taskId)
      .map((entrega: any) => ({
        id: entrega.id_entrega.toString(),
        studentId: entrega.id_usuario.toString(),
        studentName: 'Estudiante', // TODO: Agregar nombre desde backend
        submittedAt: entrega.fecha_entrega,
        grade: null, // TODO: Conectar con evaluaciones
        feedback: null, // TODO: Conectar con comentarios
        status: 'SUBMITTED',
        avatarUrl: null,
        attachments: entrega.archivos?.map((archivo: any) => ({
          id: archivo.id_archivo_entrega.toString(),
          type: archivo.tipo_archivo,
          title: archivo.nombre_archivo,
          url: archivo.url_archivo
        })) || []
      }));
  } catch (error: any) {
    console.error('Error al obtener lista de entregas:', error);
    return [];
  }
};

/**
 * Guarda la calificación y feedback de una entrega
 * TODO: Conectar con backend de Teacher para evaluaciones
 */
export const saveGrade = async (
  submissionId: string,
  grade?: number,
  feedback?: string
): Promise<Submission> => {
  try {
    // TODO: Implementar con backend de Teacher
    // const response = await axiosTeacher.post(`/evaluaciones`, {
    //   id_entrega: submissionId,
    //   puntuacion: grade,
    //   comentario_general: feedback
    // });

    console.warn('saveGrade: No implementado aún');
    throw new Error('Funcionalidad de calificación no disponible aún');
  } catch (error: any) {
    console.error('Error al guardar calificación:', error);
    throw error;
  }
};
