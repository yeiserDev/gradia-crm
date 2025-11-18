import { useQuery } from '@tanstack/react-query';
import { getTaskDetails } from '@/lib/services/core/taskService';

// Clave de caché para los detalles de una tarea
export const TASK_DETAILS_KEY = 'taskDetails';

/**
 * Hook para OBTENER los detalles de una tarea específica.
 */
export const useTaskDetails = (taskId: string | null | undefined) => {
  
  const { data, isLoading, isError } = useQuery({
    // La clave depende del taskId
    queryKey: [TASK_DETAILS_KEY, taskId],
    
    // Llama a nuestro nuevo servicio simulado
    queryFn: () => getTaskDetails(taskId!),
    
    // ¡Importante! Solo se ejecuta si 'taskId' NO es nulo
    enabled: !!taskId, 
  });

  return { data, isLoading, isError };
};