import { axiosAuth } from '../config/axiosAuth';
import { 
  ForgotPasswordPayload, // Usamos el tipo que ya definimos
  PasswordResponse 
} from '../../types/auth/password.model'; 

/**
 * Llama al endpoint POST /api/auth/forgot-password
 [cite_start]* [cite: 990-994]
 */
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<PasswordResponse> => {
  
  // Hacemos el POST, enviando el { email }
  const { data } = await axiosAuth.post<PasswordResponse>('/forgot-password', payload);
  
  // El backend responde: { message: 'Si tu correo está registrado...' }
  return data;
};