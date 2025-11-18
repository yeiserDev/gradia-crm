import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/lib/services/core/getCourses';
import { getTeacherCourses } from '@/lib/services/teacher/courseService';
import { useAuth } from '@/context/AuthProvider';

// Clave única para la caché de cursos
export const COURSES_QUERY_KEY = ['courses'];

/**
 * Hook unificado para obtener cursos
 * - Si el usuario es DOCENTE → usa backend Teacher
 * - Si el usuario es ESTUDIANTE → usa backend Student
 */
export const useCourses = () => {
  const { user } = useAuth();

  // Determinar si el usuario es DOCENTE
  const isTeacher = user?.roles?.includes('DOCENTE') || user?.roles?.includes('ADMIN');

  const {
    data: courses,
    isLoading,
    isError,
    error
  } = useQuery({
    // La clave de caché incluye el rol para diferenciar
    queryKey: [COURSES_QUERY_KEY, user?.id_usuario, isTeacher ? 'teacher' : 'student'],

    // Usar el backend apropiado según el rol
    queryFn: isTeacher ? getTeacherCourses : getCourses,

    // Solo ejecutar si el usuario está cargado
    enabled: !!user,
  });

  return { courses, isLoading, isError, error };
};