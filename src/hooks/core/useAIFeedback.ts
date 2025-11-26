import { useQuery } from '@tanstack/react-query';
import { getAIFeedback, type AIFeedbackData } from '@/lib/services/core/getAIFeedback';

/**
 * Hook para obtener retroalimentación de IA desde Elasticsearch
 * @param entregaId - ID de la entrega
 * @param userRoles - Roles del usuario (opcional, por defecto usa backend de estudiante)
 */
export function useAIFeedback(entregaId?: string | number | null, userRoles?: string[]) {
  return useQuery<AIFeedbackData | null>({
    queryKey: ['ai-feedback', entregaId],
    queryFn: () => {
      if (!entregaId) return Promise.resolve(null);
      return getAIFeedback(entregaId, userRoles);
    },
    enabled: !!entregaId,
    staleTime: 0, // Siempre considerar datos obsoletos para forzar refetch
    retry: 1,
  });
}
