import { axiosAuth } from '../config/axiosAuth';
import { AxiosError } from 'axios';

export const startGoogleLogin = async (): Promise<void> => {
  try {
    await axiosAuth.get('/google', {
      // 🔑 CLAVE 1: Aceptamos 2xx y 3xx para evitar que lance un error por la redirección
      validateStatus: (status) => status >= 200 && status < 400, 
      
      // 🔑 CLAVE 2: Evitamos que Axios siga el 302, dejando que el navegador lo haga
      maxRedirects: 0, 
    });
  } catch (error) {
    
    // 🔑 CORRECCIÓN CLAVE: Usamos el type guard para el 302
    if (error instanceof AxiosError && error.response && error.response.status === 302) {
        // El backend respondió 302 (ÉXITO). El navegador se encargará de ir a Google.
        return; 
    }
    
    // Si el error es de red (Network Error) o un 5xx, lanzamos el error original.
    console.error("Error al iniciar flujo de Google:", error);
    
    // Lanzamos un error genérico (solucionando el 'unknown' si no es AxiosError)
    throw new Error("No se pudo conectar al servicio de Google Auth.");
  }
};