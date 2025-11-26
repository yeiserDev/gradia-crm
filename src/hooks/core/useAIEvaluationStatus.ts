import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { getAIFeedback, type AIFeedbackData } from '@/lib/services/core/getAIFeedback';
import { toast } from 'sonner';

/**
 * Hook para hacer polling y detectar cuando la evaluación de IA está completa
 * @param entregaId - ID de la entrega a monitorear
 * @param enabled - Si el polling debe estar activo
 * @param userRoles - Roles del usuario (opcional, por defecto usa backend de estudiante)
 * @returns Estado de la evaluación: 'evaluating' | 'completed' | 'not_started'
 */
export function useAIEvaluationStatus(
  entregaId?: string | number | null,
  enabled: boolean = true,
  userRoles?: string[]
) {
  const hasNotifiedRef = useRef(false);

  const { data, isLoading } = useQuery<AIFeedbackData | null>({
    queryKey: ['ai-feedback', entregaId], // MISMO cache que useAIFeedback para sincronización
    queryFn: () => {
      if (!entregaId) return Promise.resolve(null);
      return getAIFeedback(entregaId, userRoles);
    },
    enabled: enabled && !!entregaId,
    refetchInterval: (query) => {
      const feedbackData = query.state.data;
      // Si ya hay datos completos (evaluación con nota final), detener el polling
      if (feedbackData?.nota_final != null) return false;
      // Si no hay datos o datos incompletos, seguir haciendo polling cada 5 segundos
      return 5000; // 5 segundos (más agresivo)
    },
    retry: 1,
    staleTime: 0, // Siempre considerarlos obsoletos para refetch
    refetchOnMount: true, // Refetch cuando el componente se monta
    refetchOnWindowFocus: true, // Refetch cuando vuelve a la ventana
  });

  // Mostrar notificación cuando la evaluación esté completa
  useEffect(() => {
    if (data && !hasNotifiedRef.current && enabled) {
      hasNotifiedRef.current = true;

      toast.success('✅ Calificado por IA', {
        description: `Tu entrega ha sido evaluada. Nota: ${data.nota_final.toFixed(2)}/20`,
        duration: 8000,
        action: {
          label: 'Ver detalle',
          onClick: () => {
            // El usuario puede hacer clic en "Ver detalle" en el header
            console.log('Usuario solicitó ver detalle de evaluación IA');
          },
        },
      });
    }
  }, [data, enabled]);

  // Reset de notificación cuando cambia la entrega
  useEffect(() => {
    hasNotifiedRef.current = false;
  }, [entregaId]);

  return {
    status: data?.nota_final != null ? 'completed' : (isLoading ? 'checking' : 'evaluating'),
    data,
    isLoading,
  };
}
