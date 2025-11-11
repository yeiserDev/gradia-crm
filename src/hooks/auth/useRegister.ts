import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { registerUser } from '../../lib/services/auth/register';
import { RegisterCredentials } from '../../lib/types/auth/register.model';

export const useRegister = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { 
    mutate: handleRegister, // 👈 Renombrado a 'handleRegister'
    isPending: isLoading
  } = useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
    
    onSuccess: () => {
      setError(null);
      // Éxito, redirigir a login con un mensaje
      router.push('/auth/login?status=registered'); 
    },
    
    onError: (err) => {
      if (err instanceof AxiosError) {
        // Ej. 409 (EMAIL YA REGISTRADO)
        setError(err.response?.data?.message || 'Error al registrar la cuenta.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  });

  // Devolvemos el "contrato" que tu página espera
  return { handleRegister, isLoading, error };
};