import { useEffect, useState, useCallback } from 'react';
import { ProfileService } from '../services/profile.services';

export const useProfile = (user_id: number | undefined) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user_id) {
      setLoading(false);
      return;
    }

    try {
      const res = await ProfileService.getProfile(user_id);
      setProfile(res);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (data: any) => {
      setUpdating(true);
      setError(null);

      try {
        const updated = await ProfileService.updateProfile(user_id!, data);
        setProfile(updated);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setUpdating(false);
      }
    },
    [user_id]
  );

  return {
    profile,
    loading,
    updating,
    error,
    fetchProfile,
    updateProfile,
  };
};
