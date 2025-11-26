import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUnit, CreateUnitPayload } from '@/lib/services/core/unitService';
import { COURSES_QUERY_KEY } from './useCourses';

/**
 * Hook (Mutación) para CREAR una nueva unidad/módulo
 *
 * Invalida automáticamente la caché de cursos para refrescar la UI
 */
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data: CreateUnitPayload) => createUnit(data),

    onSuccess: (createdUnit) => {
      console.log('✅ Unidad creada exitosamente:', createdUnit);

      // Invalida la caché de cursos para que se recargue con la nueva unidad
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });

      // También podríamos invalidar la caché específica del curso si existiera
      // queryClient.invalidateQueries({ queryKey: ['course', createdUnit.id_curso] });
    },

    onError: (err: unknown) => {
      console.error('❌ Error al crear unidad:', err);
    },
  });

  return {
    createUnit: mutateAsync,
    isLoading,
    error,
  };
};
