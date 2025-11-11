// src/hooks/auth/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { loginUser } from '../../lib/services/auth/login';
import { LoginCredentials } from '../../lib/types/auth/login.model';
import { ME_QUERY_KEY } from './useMe';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // <-- AÑADIDO

  const { 
    mutate: login, 
    isPending: isLoading 
    // Ya no necesitamos 'isError' o 'error' fuera del hook
  } = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    
    onSuccess: () => {
      setErrorMsg(null); // Limpiamos el error al tener éxito
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      router.push('/dashboard?tab=general'); 
    },
    
    onError: (err) => {
      // ¡Aquí está la magia!
      // Si el error es 401 (Credenciales inválidas)
      if (err instanceof AxiosError && err.response?.status === 401) {
        setErrorMsg('Credenciales inválidas. Revisa tu correo y contraseña.');
      } else {
        setErrorMsg('Ocurrió un error inesperado. Intenta de nuevo.');
      }
    }
  });

  // Devolvemos el "contrato" que tu página necesita
  return { login, isLoading, errorMsg }; 
};