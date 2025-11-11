import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/lib/services/core/getCourses';
import { useAuth } from '@/context/AuthProvider'; // Para obtener el ID del usuario

// Clave única para la caché de cursos
export const COURSES_QUERY_KEY = ['courses'];

export const useCourses = () => {
  const { user } = useAuth(); // Obtenemos el usuario logueado

  const { 
    data: courses,  // Los datos de los cursos
    isLoading,     // true mientras hace el fetch
    isError,       // true si la petición falla
    error          // El objeto de error
  } = useQuery({
    // La clave de caché depende del ID del usuario
    queryKey: [COURSES_QUERY_KEY, user?.id_usuario], 
    
    // La función que se ejecutará
    queryFn: () => getCourses(user!.id_usuario),
    
    // ¡Importante! No ejecuta el query si el usuario aún no ha cargado
    enabled: !!user, 
  });

  return { courses, isLoading, isError, error };
};