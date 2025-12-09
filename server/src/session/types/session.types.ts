
import { User } from 'src/users/entities/user.entity';

export interface IAuthForSession {
  auth_id: number;
  userID: string;
  user: User;
}
