import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { forgotPassword } from '@/lib/services/auth/forgotPassword';
import { ForgotPasswordPayload } from '@/lib/types/auth/password.model';
import { AxiosError } from 'axios'; // Para un mejor manejo de errores

export const useForgotPassword = () => {
  // Usamos un estado local para el error, para que sea un string
  const [error, setError] = useState<string | null>(null);

  const { 
    mutate: handleForgotPassword, // 👈 Renombramos 'mutate'
    isPending: isLoading,       // 👈 Renombramos 'isPending'
    isSuccess: isSent           // 👈 Renombramos 'isSuccess'
  } = useMutation({
    mutationFn: (credentials: ForgotPasswordPayload) => forgotPassword(credentials),
    
    onSuccess: () => {
      setError(null); // Limpiamos cualquier error anterior
    },
    
    onError: (err) => {
      // Si el backend nos da un error, lo mostramos
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Error al enviar el correo.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    },
  });

  // Devolvemos el "contrato" exacto que tu componente espera
  return { 
    handleForgotPassword, 
    isLoading, 
    error, 
    isSent 
  };
};