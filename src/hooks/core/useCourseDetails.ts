import { useState, useEffect } from 'react';
import { getCourseById } from '@/lib/services/core/courseService';
import { Course } from '@/lib/types/core/course.model';

/**
 * Hook para obtener los detalles completos de un curso
 * Carga el curso con todas sus unidades y actividades desde la API
 *
 * @param courseId - ID del curso a cargar
 * @param userRoles - Roles del usuario para determinar qué backend usar
 */
export const useCourseDetails = (courseId: string, userRoles?: string[]) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = async () => {
    if (!courseId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const courseData = await getCourseById(courseId, userRoles);
      setCourse(courseData);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar el curso';
      setError(errorMessage);
      console.error('Error en useCourseDetails:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  /**
   * Función para refrescar manualmente el curso
   * Útil después de crear/editar/eliminar unidades o actividades
   */
  const refresh = () => {
    loadCourse();
  };

  return {
    course,
    isLoading,
    error,
    refresh,
  };
};
