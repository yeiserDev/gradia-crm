import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { changePassword } from '@/lib/services/auth/changePassword';
import { ChangePasswordPayload } from '@/lib/types/auth/password.model';

export const useChangePassword = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { 
    mutate: performChange, 
    isPending: isLoading 
  } = useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    
    onSuccess: () => {
      setErrorMsg(null);
      setIsSuccess(true);
    },
    
    onError: (err) => {
      setIsSuccess(false);
      if (err instanceof AxiosError) {
        // El backend suele devolver { message: "..." }
        setErrorMsg(err.response?.data?.message || 'Error al cambiar la contraseña.');
      } else {
        setErrorMsg('Ocurrió un error inesperado.');
      }
    }
  });

  // Función para limpiar estados al cerrar el modal
  const reset = () => {
    setErrorMsg(null);
    setIsSuccess(false);
  };

  return { performChange, isLoading, errorMsg, isSuccess, reset };
};