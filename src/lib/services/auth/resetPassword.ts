import { axiosAuth } from '../config/axiosAuth';
import type { ResetPasswordPayload, PasswordResponse } from '../../types/auth/password.model'; 

/**
 * Llama al endpoint POST /api/auth/reset-password
 * @param payload - Objeto con { token, newPassword }
 */
export const resetPassword = async (payload: ResetPasswordPayload): Promise<PasswordResponse> => {
  // El backend no necesita el confirmPassword, solo newPassword
  const { data } = await axiosAuth.post<PasswordResponse>('/reset-password', payload);
  return data;
};