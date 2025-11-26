import { axiosStudent } from '../config/axiosStudent';
import { axiosTeacher } from '../config/axiosTeacher';

export interface AIFeedbackData {
  notas_por_criterio: Record<string, number>;
  retroalimentaciones_por_criterio: Record<string, string>;
  retroalimentacion_final: string;
  nota_final: number;
}

interface AIFeedbackResponse {
  success: boolean;
  data: AIFeedbackData;
  message: string;
}

/**
 * Obtiene la retroalimentación de IA desde Elasticsearch para una entrega específica
 * @param entregaId - ID de la entrega
 * @param userRoles - Roles del usuario (para determinar qué backend usar)
 */
export const getAIFeedback = async (
  entregaId: string | number,
  userRoles?: string[]
): Promise<AIFeedbackData | null> => {
  try {
    const isTeacherOrAdmin = userRoles?.some(role => ['DOCENTE', 'ADMIN'].includes(role));
    const axios = isTeacherOrAdmin ? axiosTeacher : axiosStudent;
    const endpoint = isTeacherOrAdmin
      ? `/evaluaciones/retroalimentacion/${entregaId}`
      : `/evaluaciones/retroalimentacion/${entregaId}`;

    console.log(`🤖 Obteniendo retroalimentación de IA - Entrega: ${entregaId}`);

    const response = await axios.get<AIFeedbackResponse>(endpoint);

    if (!response.data.success) {
      console.warn('⚠️ No se pudo obtener retroalimentación de IA:', response.data.message);
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener retroalimentación de IA:', error);
    return null;
  }
};
