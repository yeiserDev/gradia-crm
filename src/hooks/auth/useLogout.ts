import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/services/auth/logout';

/**
 * Hook (Mutación) para manejar el cierre de sesión
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser, // Llama al servicio que creamos
    
    onSuccess: () => {
      // 1. Limpia TODA la caché de React Query
      queryClient.clear(); 
      
      // 2. Redirige al usuario a la página de login
      router.replace('/auth/login');
    },
    
    onError: (err) => {
      // 3. Incluso si falla, limpia la caché y redirige
      console.error("Error al hacer logout:", err);
      queryClient.clear();
      router.replace('/auth/login');
    }
  });

  return { logout, isLoading };
};