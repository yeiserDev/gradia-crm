import { axiosAuth } from '../config/axiosAuth';
import { 
  LoginCredentials, 
  LoginResponse 
} from '../../types/auth/login.model';

/**
 * Llama al endpoint POST /api/auth/login
 * @param credentials - Objeto con { email, password }
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {

  const { data } = await axiosAuth.post<LoginResponse>('/login', credentials);
  
  return data;
};