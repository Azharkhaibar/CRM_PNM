import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    user_id?: number | null;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    category?: string;
    expiresAt?: Date | null;
}
