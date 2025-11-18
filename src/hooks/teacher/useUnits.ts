import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllUnits,
  getUnitById,
  getUnitsByCourse,
  createUnit,
  updateUnit,
  deleteUnit,
  type CreateUnitPayload,
  type UpdateUnitPayload
} from '@/lib/services/teacher/unitService';
import { TEACHER_COURSES_KEY } from './useCourses';

export const TEACHER_UNITS_KEY = ['teacher', 'units'];

/**
 * Hook para obtener todas las unidades
 */
export const useTeacherUnits = () => {
  return useQuery({
    queryKey: TEACHER_UNITS_KEY,
    queryFn: getAllUnits,
  });
};

/**
 * Hook para obtener una unidad específica
 */
export const useTeacherUnit = (unitId: string) => {
  return useQuery({
    queryKey: [...TEACHER_UNITS_KEY, unitId],
    queryFn: () => getUnitById(unitId),
    enabled: !!unitId,
  });
};

/**
 * Hook para obtener unidades de un curso
 */
export const useUnitsByCourse = (courseId: string) => {
  return useQuery({
    queryKey: [...TEACHER_COURSES_KEY, courseId, 'units'],
    queryFn: () => getUnitsByCourse(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook para crear una nueva unidad
 */
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnitPayload) => createUnit(data),
    onSuccess: (_data, variables) => {
      // Invalidar unidades y el curso al que pertenecen
      queryClient.invalidateQueries({ queryKey: TEACHER_UNITS_KEY });
      queryClient.invalidateQueries({
        queryKey: [...TEACHER_COURSES_KEY, variables.id_curso.toString(), 'units']
      });
      queryClient.invalidateQueries({
        queryKey: [...TEACHER_COURSES_KEY, variables.id_curso.toString()]
      });
    },
  });
};

/**
 * Hook para actualizar una unidad
 */
export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitId, data }: { unitId: string; data: UpdateUnitPayload }) =>
      updateUnit(unitId, data),
    onSuccess: (_data, variables) => {
      // Invalidar la lista de unidades y la unidad específica
      queryClient.invalidateQueries({ queryKey: TEACHER_UNITS_KEY });
      queryClient.invalidateQueries({ queryKey: [...TEACHER_UNITS_KEY, variables.unitId] });
    },
  });
};

/**
 * Hook para eliminar una unidad
 */
export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitId: string) => deleteUnit(unitId),
    onSuccess: () => {
      // Invalidar la lista de unidades
      queryClient.invalidateQueries({ queryKey: TEACHER_UNITS_KEY });
    },
  });
};
