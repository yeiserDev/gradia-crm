import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../lib/services/auth/me';

// Clave única para la caché de React Query
export const ME_QUERY_KEY = ['me'];

export const useMe = () => {
  const { 
    data: user,     // Los datos del usuario (tipo 'User')
    isLoading,      // true mientras hace el fetch
    isError,        // true si la petición falla (ej. 401)
    error           // El objeto de error
  } = useQuery({
    queryKey: ME_QUERY_KEY,  // La clave de caché
    queryFn: getMe,          // La función de servicio que creamos
    
    // Opcional: Configuraciones útiles
    retry: false, // No reintentar si falla (ej. 401)
    refetchOnWindowFocus: false, // Evita recargas innecesarias
    staleTime: 1000 * 60 * 15, // 15 mins (mismo tiempo que tu accessToken)
  });

  return { user, isLoading, isError, error };
};