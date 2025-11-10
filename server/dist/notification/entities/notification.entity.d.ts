import { User } from 'src/users/entities/user.entity';
export declare enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
    SYSTEM = "system"
}
export declare class Notification {
    notification_id: number;
    user_id: number;
    user: User;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    metadata: Record<string, any> | null;
    category: string;
    created_at: Date;
    expires_at: Date | null;
}
