import { axiosAuth } from '../config/axiosAuth';
import { User } from '../../types/auth/user.model';

// Tu backend responde: { data: { id_usuario, ... } }
interface MeResponse {
  data: User;
}

/**
 * Llama al endpoint GET /api/auth/me
 * (Axios se encarga de enviar la cookie automáticamente)
 */
export const getMe = async (): Promise<User> => {
  
  const { data } = await axiosAuth.get<MeResponse>('/me');
  
  // Devolvemos solo el objeto 'user' que está dentro de 'data'
  return data.data; 
};