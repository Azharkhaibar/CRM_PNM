// services/profile.service.js
import PROFILE_API from '../api/profile.api';
import { AxiosError } from 'axios';

// Local storage key untuk menyimpan profile data (hanya untuk read fallback)
const PROFILE_STORAGE_KEY = 'user_profile_data';

// Get user from auth context as fallback
const getAuthUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Get profile from localStorage (hanya untuk read)
const getStoredProfile = (user_id: number) => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      const profiles = JSON.parse(stored);
      return profiles[user_id] || null;
    }
  } catch (error) {
    console.error('Error reading stored profile:', error);
  }
  return null;
};

// Save profile to localStorage (hanya untuk read cache)
const saveProfileToStorage = (user_id: number, profile: any) => {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    const profiles = stored ? JSON.parse(stored) : {};
    profiles[user_id] = {
      ...profile,
      storage_updated_at: new Date().toISOString(), // tandai sebagai cache
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving profile to storage:', error);
  }
};

export const ProfileService = {
  getProfile: async (user_id: number) => {
    try {
      console.log('🎯 [SERVICE] Fetching REAL data for user:', user_id);
      const res = await PROFILE_API.getProfile(user_id);

      if (!res.data || !res.data.userID) {
        throw new Error('Invalid response data from backend');
      }

      console.log('✅ [SERVICE] Real backend data received:', res.data);

      saveProfileToStorage(user_id, res.data);

      return res.data;
    } catch (err: any) {
      console.error('[SERVICE] Backend API gagal :( ):', err);

   
      const storedProfile = getStoredProfile(user_id);
      if (storedProfile) {
        console.warn('⚠️ Using cached data - backend might be unavailable');
        return storedProfile;
      }

      const authUser = getAuthUser();
      if (authUser) {
        console.log('🔄 [SERVICE] Using auth data as READ-ONLY fallback');
        console.warn('⚠️ Using auth data - backend might be unavailable');
        const fallbackData = {
          user_id: authUser.user_id || user_id,
          userID: authUser.userID || `user${user_id}`,
          role: authUser.role || 'USER',
          gender: authUser.gender || 'MALE',
          divisi: authUser.divisi || { divisi_id: 1, name: 'Compliance' },
          created_at: authUser.created_at || new Date().toISOString(),
          updated_at: authUser.updated_at || new Date().toISOString(),
          is_cached: true,
        };
        return fallbackData;
      }

      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || err.message || 'Backend Error 500';
        throw new Error(`Backend Error: ${errorMessage}`);
      }
      throw err;
    }
  },

  updateProfile: async (user_id: number, data: any) => {
    try {
      console.log('🎯 [SERVICE] Update profile via API:', { user_id, data });

      if (!data.role || !data.gender) {
        throw new Error('Role and gender are required');
      }

      const res = await PROFILE_API.updateProfile(user_id, data);

      if (!res.data) {
        throw new Error('No response data from server');
      }

      console.log('✅ [SERVICE] API update successful:', res.data);

      saveProfileToStorage(user_id, res.data);

      return res.data;
    } catch (err: any) {
      console.error('❌ [SERVICE] API update failed:', err);

      let errorMessage = 'Failed to update profile';

      if (err instanceof AxiosError) {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message;

        console.error('🔍 [SERVICE] Detailed API Error:', {
          status,
          serverMessage,
          data: err.response?.data,
          url: err.config?.url,
          method: err.config?.method,
        });

        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Invalid data sent to server';
            break;
          case 404:
            errorMessage = 'User not found';
            break;
          case 500:
            errorMessage = 'Internal server error - please try again later';
            break;
          default:
            errorMessage = serverMessage || `Server error: ${status}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      throw new Error(errorMessage);
    }
  },
};
