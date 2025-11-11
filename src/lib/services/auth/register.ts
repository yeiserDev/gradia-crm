import { axiosAuth } from '../config/axiosAuth';
import { 
  RegisterCredentials, 
  RegisterResponse 
} from '../../types/auth/register.model';

/**
 * Llama al endpoint POST /api/auth/register
 * @param credentials - Objeto con { nombre, apellido, correo, password, ... }
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  
  // Hacemos el POST, enviando los datos del nuevo usuario en el body
  const { data } = await axiosAuth.post<RegisterResponse>('/register', credentials);
  
  // El backend responde: { message: '...', data: { id_usuario, ... } }
  return data;
};