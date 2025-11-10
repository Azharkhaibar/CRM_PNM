import { Gender, Role } from '../enum/userEnum';
import { Auth } from 'src/auth/entities/auth.entity';
import { Divisi } from 'src/divisi/entities/divisi.entity';
import { Notification } from 'src/notification/entities/notification.entity';
export declare class User {
    user_id: number;
    userID: string;
    role: Role;
    notifications: Notification[];
    gender: Gender;
    divisi: Divisi | null;
    auth: Auth;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
