import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTeacherCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  type CreateCoursePayload,
  type UpdateCoursePayload
} from '@/lib/services/teacher/courseService';

export const TEACHER_COURSES_KEY = ['teacher', 'courses'];

/**
 * Hook para obtener todos los cursos del docente
 */
export const useTeacherCourses = () => {
  return useQuery({
    queryKey: TEACHER_COURSES_KEY,
    queryFn: getTeacherCourses,
  });
};

/**
 * Hook para obtener un curso específico
 */
export const useTeacherCourse = (courseId: string) => {
  return useQuery({
    queryKey: [...TEACHER_COURSES_KEY, courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook para crear un nuevo curso
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoursePayload) => createCourse(data),
    onSuccess: () => {
      // Invalidar la lista de cursos para refrescarla
      queryClient.invalidateQueries({ queryKey: TEACHER_COURSES_KEY });
    },
  });
};

/**
 * Hook para actualizar un curso
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: UpdateCoursePayload }) =>
      updateCourse(courseId, data),
    onSuccess: (_data, variables) => {
      // Invalidar la lista de cursos y el curso específico
      queryClient.invalidateQueries({ queryKey: TEACHER_COURSES_KEY });
      queryClient.invalidateQueries({ queryKey: [...TEACHER_COURSES_KEY, variables.courseId] });
    },
  });
};

/**
 * Hook para eliminar un curso
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      // Invalidar la lista de cursos
      queryClient.invalidateQueries({ queryKey: TEACHER_COURSES_KEY });
    },
  });
};
