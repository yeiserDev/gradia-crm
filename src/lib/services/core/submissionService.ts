import { Submission } from '@/lib/types/core/submission.model';
import { axiosStudent } from '../config/axiosStudent';
import { axiosTeacher } from '../config/axiosTeacher';

/**
 * TEACHER: Obtiene la lista de entregas de todos los estudiantes para una actividad
 * Conectado al backend de Teacher: GET /api/entregas/actividad/:actividadId
 */
export const getSubmissionsList = async (taskId: string): Promise<Submission[]> => {
  try {
    console.log(`📥 Obteniendo entregas para actividad ${taskId}...`);

    // 🔧 Llamada al backend de Teacher
    const response = await axiosTeacher.get(`/entregas/actividad/${taskId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener entregas');
    }

    // El backend devuelve data: [...] (array directo de estudiantes/entregas)
    // O data: { entregas: [...], estadisticas: ... } dependiendo del endpoint.
    // Con mi cambio reciente en getEntregasByActividad, devuelve data: [...] (array directo).
    const entregas = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data.data.entregas || []);

    console.log(`✅ ${entregas.length} entregas encontradas`);

    type EntregaBackend = {
      id_entrega: number;
      id_usuario: number;
      fecha_entrega: string;
      calificacion?: number;
      retroalimentacion?: string;
      usuario?: {
        id_usuario: number;
        correo_institucional: string;
        persona?: {
          nombre: string;
          apellido: string;
        };
      };
      archivos?: Array<{
        id_archivo_entrega: number;
        tipo_archivo: string;
        nombre_archivo: string;
        url_archivo: string;
      }>;
    };

    // Mapear entregas del backend al formato del frontend
    return entregas.map((entrega: EntregaBackend) => {
      // Determinar el status correcto
      let status: 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED' = 'NOT_SUBMITTED';

      if (entrega.id_entrega) {
        // Tiene entrega
        if (entrega.calificacion !== null && entrega.calificacion !== undefined) {
          status = 'GRADED'; // Está calificado
        } else {
          status = 'SUBMITTED'; // Entregó pero no está calificado
        }
      } else {
        status = 'NOT_SUBMITTED'; // No ha entregado
      }

      return {
        id: entrega.id_entrega?.toString() || '0',
        studentId: entrega.id_usuario?.toString() || '0',
        studentName: entrega.usuario?.persona
          ? `${entrega.usuario.persona.nombre} ${entrega.usuario.persona.apellido}`
          : `Estudiante ${entrega.id_usuario || '?'}`,
        submittedAt: entrega.fecha_entrega || null,
        grade: entrega.calificacion ?? null,
        feedback: entrega.retroalimentacion ?? null,
        status: status,
        avatarUrl: null, // No hay foto en BD, usar fallback del componente
        attachments: entrega.archivos?.map((archivo) => ({
          id: archivo.id_archivo_entrega?.toString() || '0',
          type: archivo.tipo_archivo || 'unknown',
          title: archivo.nombre_archivo || 'Sin título',
          url: archivo.url_archivo || '#'
        })) || []
      };
    });
  } catch (error) {
    console.error('Error al obtener lista de entregas:', error);
    return [];
  }
};

/**
 * Guarda la calificación y feedback de una entrega
 * Conectado al backend de Teacher: PUT /api/entregas/:id/calificar
 */
export const saveGrade = async (
  submissionId: string,
  grade?: number,
  feedback?: string
): Promise<Submission> => {
  try {
    console.log(`📝 Guardando calificación para entrega ${submissionId}...`, { grade, feedback });

    // Llamada al backend de Teacher
    const response = await axiosTeacher.put(`/entregas/${submissionId}/calificar`, {
      calificacion: grade,
      retroalimentacion: feedback
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al guardar calificación');
    }

    console.log('✅ Calificación guardada exitosamente');

    // Mapear la respuesta del backend al formato del frontend
    const entrega = response.data.data;

    return {
      id: entrega.id_entrega?.toString() || '0',
      studentId: entrega.id_usuario?.toString() || '0',
      studentName: 'Estudiante', // No tenemos el nombre en la respuesta, se actualizará al refrescar
      submittedAt: entrega.fecha_entrega || null,
      grade: entrega.calificacion ?? null,
      feedback: entrega.retroalimentacion ?? null,
      status: entrega.calificacion !== null && entrega.calificacion !== undefined ? 'GRADED' : 'SUBMITTED',
      avatarUrl: null,
      attachments: entrega.archivos?.map((archivo: any) => ({
        id: archivo.id_archivo_entrega?.toString() || '0',
        type: archivo.tipo_archivo || 'unknown',
        title: archivo.nombre_archivo || 'Sin título',
        url: archivo.url_archivo || '#'
      })) || []
    };
  } catch (error: any) {
    console.error('❌ Error al guardar calificación:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al guardar la calificación');
  }
};
