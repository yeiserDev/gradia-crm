import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveGrade } from '@/lib/services/core/submissionService';
import { SUBMISSIONS_LIST_KEY } from './useTaskSubmissionsList'; // Importamos la clave

/**
 * Hook (Mutación) para GUARDAR la nota de una entrega.
 */
export const useSaveGrade = (taskId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: ({ submissionId, grade, feedback }: { 
      submissionId: string, 
      grade?: number, 
      feedback?: string 
    }) => saveGrade(submissionId, grade, feedback),
    
    onSuccess: () => {
      // ¡Clave! Al guardar una nota, refresca la lista de entregas
      queryClient.invalidateQueries({ queryKey: [SUBMISSIONS_LIST_KEY, taskId] });
    },
    onError: (err) => {
      console.error("Error al guardar la nota:", err);
      alert("Error al guardar la nota.");
    }
  });

  return { saveGrade: mutate, isLoading };
};