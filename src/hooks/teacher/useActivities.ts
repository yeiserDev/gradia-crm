import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllActivities,
  getActivityById,
  getActivitiesByUnit,
  getActivitiesByCourse,
  createActivity,
  updateActivity,
  deleteActivity,
  type CreateActivityPayload,
  type UpdateActivityPayload
} from '@/lib/services/teacher/activityService';
import { TEACHER_UNITS_KEY } from './useUnits';
import { TEACHER_COURSES_KEY } from './useCourses';

export const TEACHER_ACTIVITIES_KEY = ['teacher', 'activities'];

/**
 * Hook para obtener todas las actividades
 */
export const useTeacherActivities = () => {
  return useQuery({
    queryKey: TEACHER_ACTIVITIES_KEY,
    queryFn: getAllActivities,
  });
};

/**
 * Hook para obtener una actividad específica
 */
export const useTeacherActivity = (activityId: string) => {
  return useQuery({
    queryKey: [...TEACHER_ACTIVITIES_KEY, activityId],
    queryFn: () => getActivityById(activityId),
    enabled: !!activityId,
  });
};

/**
 * Hook para obtener actividades de una unidad
 */
export const useActivitiesByUnit = (unitId: string) => {
  return useQuery({
    queryKey: [...TEACHER_UNITS_KEY, unitId, 'activities'],
    queryFn: () => getActivitiesByUnit(unitId),
    enabled: !!unitId,
  });
};

/**
 * Hook para obtener actividades de un curso
 */
export const useActivitiesByCourse = (courseId: string) => {
  return useQuery({
    queryKey: [...TEACHER_COURSES_KEY, courseId, 'activities'],
    queryFn: () => getActivitiesByCourse(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook para crear una nueva actividad
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityPayload) => createActivity(data),
    onSuccess: (_data, variables) => {
      // Invalidar actividades y la unidad a la que pertenecen
      queryClient.invalidateQueries({ queryKey: TEACHER_ACTIVITIES_KEY });
      queryClient.invalidateQueries({
        queryKey: [...TEACHER_UNITS_KEY, variables.id_unidad.toString(), 'activities']
      });
      queryClient.invalidateQueries({
        queryKey: [...TEACHER_UNITS_KEY, variables.id_unidad.toString()]
      });
    },
  });
};

/**
 * Hook para actualizar una actividad
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, data }: { activityId: string; data: UpdateActivityPayload }) =>
      updateActivity(activityId, data),
    onSuccess: (_data, variables) => {
      // Invalidar la lista de actividades y la actividad específica
      queryClient.invalidateQueries({ queryKey: TEACHER_ACTIVITIES_KEY });
      queryClient.invalidateQueries({ queryKey: [...TEACHER_ACTIVITIES_KEY, variables.activityId] });
    },
  });
};

/**
 * Hook para eliminar una actividad
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) => deleteActivity(activityId),
    onSuccess: () => {
      // Invalidar la lista de actividades
      queryClient.invalidateQueries({ queryKey: TEACHER_ACTIVITIES_KEY });
    },
  });
};
