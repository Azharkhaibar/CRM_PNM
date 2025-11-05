import { Gender, Role } from '../enum/userEnum';
import { Auth } from 'src/auth/entities/auth.entity';
export declare class User {
    user_id: number;
    userID: string;
    role: Role;
    gender: Gender;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    auth: Auth;
}
