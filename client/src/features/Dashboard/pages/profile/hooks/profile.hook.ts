import { useEffect, useState, useCallback } from 'react';
import { ProfileService } from '../services/profile.services';

interface Profile {
  user_id: number;
  userID: string;
  role: string;
  gender: string;
  divisi?: {
    divisi_id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = (user_id: number | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user_id) {
      console.log('[HOOK] No user_id provided');
      setLoading(false);
      return;
    }

    console.log('🎯 [HOOK] Starting profile fetch for user:', user_id);
    setLoading(true);
    setError(null);

    try {
      const res = await ProfileService.getProfile(user_id);;
      setProfile(res);
    } catch (err: any) {
      console.error('[HOOK] Fetch Profile gagal :(:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (data: any) => {
      if (!user_id) {
        setError('User ID tidak tersedia');
        return;
      }

      console.log('update profile:', data);
      setUpdating(true);
      setError(null);

      try {
        const updated = await ProfileService.updateProfile(user_id, data);
        console.log('✅ [HOOK] Profile updated successfully:', updated);

        setProfile(updated);
        return updated;
      } catch (err: any) {
        console.error('[HOOK] Profile update failed:', err.message);
        setError(err.message);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [user_id]
  );

  const refetch = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updating,
    error,
    fetchProfile: refetch,
    updateProfile,
  };
};
