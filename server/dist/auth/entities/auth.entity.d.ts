import { User } from 'src/users/entities/user.entity';
export declare class Auth {
    auth_id: number;
    userID: string;
    hash_password: string;
    refresh_token?: string;
    reset_password_token?: string;
    user: User;
    sessions: any;
}
