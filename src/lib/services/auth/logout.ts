import { axiosAuth } from '../config/axiosAuth';

// Tu backend devuelve algo como { message: '...' }
interface LogoutResponse {
  message: string;
}

/**
 * Llama al endpoint POST /api/auth/logout
 * (El backend lee la cookie refreshToken para invalidarla)
 *
 */
export const logoutUser = async (): Promise<LogoutResponse> => {
  const { data } = await axiosAuth.post<LogoutResponse>('/logout');
  return data;
};