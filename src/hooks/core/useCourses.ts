import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/lib/services/core/getCourses';
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
    // La clave de caché depende del ID y roles del usuario
    queryKey: [COURSES_QUERY_KEY, user?.id_usuario, user?.roles],

    // ✅ Pasar los roles del usuario a getCourses para determinar qué backend usar
    queryFn: () => getCourses(user?.roles),

    // Solo ejecutar si el usuario está cargado
    enabled: !!user,
  });

  return { courses, isLoading, isError, error };
};