import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { resetPassword } from '@/lib/services/auth/resetPassword';
import type { ResetPasswordPayload } from '@/lib/types/auth/password.model';

export const useResetPassword = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { 
    mutate: reset, 
    isPending: isLoading, 
  } = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    
    onSuccess: () => {
      setErrorMsg(null);
      // Éxito: Redirigir al login con un mensaje de éxito.
      router.push('/auth/login?status=password_reset'); 
    },
    
    onError: (err) => {
      // Manejo de error si el token es inválido o expiró.
      if (err instanceof AxiosError && err.response?.status === 400) {
        setErrorMsg('Enlace inválido o expirado. Solicita una nueva recuperación.');
      } else {
        setErrorMsg('Error de conexión. Intenta de nuevo.');
      }
    }
  });

  return { reset, isLoading, errorMsg };
};