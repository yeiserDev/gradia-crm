import { useQuery } from '@tanstack/react-query';
import { getSubmissionsList } from '@/lib/services/core/submissionService';

// Clave de caché para la lista
export const SUBMISSIONS_LIST_KEY = 'taskSubmissionsList';

export const useTaskSubmissionsList = (taskId: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [SUBMISSIONS_LIST_KEY, taskId], // Depende del taskId
    queryFn: () => getSubmissionsList(taskId),
    enabled: !!taskId, // Solo se activa si hay un taskId
    refetchInterval: (query) => {
      const submissions = query.state.data;
      if (!submissions || !submissions.length) return false;

      // Verificar si hay entregas pendientes de calificación
      // NOTA: Para entregas con video, la calificación viene de Elasticsearch via useAIEvaluationStatus
      // Por ahora, hacer polling mientras haya entregas SUBMITTED (entregadas pero no calificadas)
      const hasPendingSubmissions = submissions.some(
        (submission) => submission.status === 'SUBMITTED' && submission.grade == null
      );

      return hasPendingSubmissions ? 5000 : false; // 5s (más agresivo)
    },
    refetchIntervalInBackground: true,
    staleTime: 0, // Siempre refetch cuando se solicite
  });

  return { data, isLoading, isError, refetch };
};