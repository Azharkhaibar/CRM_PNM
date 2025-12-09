import { Auth } from 'src/auth/entities/auth.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Session {
    session_id: number;
    auth: Auth;
    user: User;
    user_agent: string;
    is_active: boolean;
    expires_at: Date;
    created_at: Date;
    x: any;
}
