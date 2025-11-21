import { axiosAuth } from '../config/axiosAuth';
import { ChangePasswordPayload, PasswordResponse } from '../../types/auth/password.model';

/**
 * Llama al endpoint PUT /api/auth/password
 * @param payload - { oldPassword, newPassword }
 */
export const changePassword = async (payload: ChangePasswordPayload): Promise<PasswordResponse> => {
  const { data } = await axiosAuth.put<PasswordResponse>('/password', payload);
  return data;
};