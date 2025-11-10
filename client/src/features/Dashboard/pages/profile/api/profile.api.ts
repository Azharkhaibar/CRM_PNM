import DB_API from '../../../api/dashboard.api';

const PROFILE_API = {
  getProfile: (user_id: number) => DB_API.get(`/users/${user_id}`),

  updateProfile: (user_id: number, data: any) => DB_API.patch(`/users/${user_id}`, data),
};

export default PROFILE_API;
