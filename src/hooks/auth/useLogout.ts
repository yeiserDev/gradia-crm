// src/hooks/auth/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/services/auth/logout';

export const LOGOUT_EVENT_KEY = 'gradia-logout-event'; 

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser,

    onSuccess: async () => {

      // 1. Invalidamos la query 'me' para forzar re-evaluación inmediata
      await queryClient.invalidateQueries({ queryKey: ['me'] });

      // 2. Avisamos a otras pestañas
      localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());

      // 3. Redirigimos
      router.replace('/auth/login');
    },

    onError: async (err) => {
      console.error("Error al hacer logout:", err);

      await queryClient.invalidateQueries({ queryKey: ['me'] });
      localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());
      router.replace('/auth/login');
    }
  });

  return { logout, isLoading };
};
