import { useQuery } from '@tanstack/react-query';
import { getSubmissionsList } from '@/lib/services/core/submissionService';

// Clave de caché para la lista
export const SUBMISSIONS_LIST_KEY = 'taskSubmissionsList';

export const useTaskSubmissionsList = (taskId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [SUBMISSIONS_LIST_KEY, taskId], // Depende del taskId
    queryFn: () => getSubmissionsList(taskId),
    enabled: !!taskId, // Solo se activa si hay un taskId
  });

  return { data, isLoading, isError };
};