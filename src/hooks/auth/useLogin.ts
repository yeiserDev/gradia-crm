import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { loginUser } from '../../lib/services/auth/login';
import { LoginCredentials, LoginResponse } from '../../lib/types/auth/login.model';
import { ME_QUERY_KEY } from './useMe';


export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { 
    mutate: login, 
    isPending: isLoading 
  } = useMutation({
    mutationFn: (credentials: LoginCredentials): Promise<LoginResponse> => loginUser(credentials),
    
    onSuccess: (data) => {
      setErrorMsg(null);

      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      router.push('/dashboard?tab=general'); 
    },
    
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        setErrorMsg('Credenciales inválidas. Revisa tu correo y contraseña.');
      } else {
        setErrorMsg('Ocurrió un error inesperado. Intenta de nuevo.');
      }
    }
  });

  return { login, isLoading, errorMsg }; 
};