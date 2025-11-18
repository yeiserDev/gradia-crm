import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveTask, SaveTaskPayload } from '@/lib/services/core/taskService';
import { TASK_DETAILS_KEY } from './useTaskDetails'; // Importamos la clave
import { COURSES_QUERY_KEY } from './useCourses'; // Para refrescar la lista

/**
 * Hook (Mutación) para GUARDAR (crear/actualizar) una tarea.
 */
export const useSaveTask = () => {
  const queryClient = useQueryClient();

  const { 
    mutateAsync,  // Usamos 'async' para que el modal pueda esperar
    isPending: isLoading // Renombramos a 'isLoading'
  } = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string, data: SaveTaskPayload }) => 
      saveTask(taskId, data), // Llama al servicio
    
    onSuccess: (savedTask) => {
      // Cuando se guarda, invalida las cachés para refrescar la UI
      queryClient.invalidateQueries({ queryKey: [TASK_DETAILS_KEY, savedTask.id] });
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] }); 
    },
  });

  return { saveTask: mutateAsync, isLoading };
};