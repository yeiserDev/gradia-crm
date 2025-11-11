import { useMutation } from '@tanstack/react-query';
import { startGoogleLogin } from '@/lib/services/auth/googleAuthUrl';

export const useGoogleLogin = () => {
  const { 
    mutate: loginWithGoogle, // La función que llamaremos en el onClick
    isPending: isLoading, 
    isError, 
    error 
  } = useMutation({
    mutationFn: startGoogleLogin,
    
    // OnSuccess no hace nada porque el navegador ya fue redirigido.
    onSuccess: () => {},
    
    onError: (err) => {
        // Manejar errores de conexión si el backend no responde
        console.error("Error en la mutación de Google:", err);
    }
  });

  return { loginWithGoogle, isLoading, isError, error };
};