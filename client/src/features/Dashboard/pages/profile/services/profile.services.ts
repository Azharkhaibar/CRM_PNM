import PROFILE_API from '../api/profile.api';
import { AxiosError } from 'axios';

export const ProfileService = {
  getProfile: async (user_id: number) => {
    try {
      const res = await PROFILE_API.getProfile(user_id);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || 'gagal ambil profile');
      }
      throw err;
    }
  },

  updateProfile: async (user_id: number, data: any) => {
    try {
      const res = await PROFILE_API.updateProfile(user_id, data);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || 'gagal update profile');
      }
      throw err;
    }
  },
};
