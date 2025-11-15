import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/services/auth/logout';


export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser, // Llama a POST /logout (que limpia la cookie en el backend)
    
    onSuccess: () => {

      queryClient.clear(); 
      router.replace('/auth/login');
    },
    
    onError: (err) => {
      // Si falla, igual limpiamos el frontend
      // 🔑 REVERTIDO: Ya no limpiamos localStorage
      // localStorage.removeItem(ACCESS_TOKEN_KEY);
      
      queryClient.clear();
      router.replace('/auth/login');
    }
  });

  return { logout, isLoading };
};