"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notification_gateway_1 = require("./notification.gateway");
let NotificationService = NotificationService_1 = class NotificationService {
    notificationRepository;
    gateway;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(notificationRepository, gateway) {
        this.notificationRepository = notificationRepository;
        this.gateway = gateway;
    }
    async findAll() {
        try {
            return await this.notificationRepository.find({
                order: { created_at: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error('Failed to find all notifications', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve notifications');
        }
    }
    async findOne(notification_id) {
        try {
            const notification = await this.notificationRepository.findOne({
                where: { notification_id },
            });
            if (!notification)
                throw new common_1.NotFoundException(`Notification ${notification_id} not found`);
            return notification;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.logger.error(`Failed to find notification ${notification_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to retrieve notification');
        }
    }
    async create(createDto) {
        try {
            const notification = this.notificationRepository.create({
                ...createDto,
                user_id: Number(createDto.userId),
                expires_at: createDto.expiresAt ?? null,
            });
            const savedNotification = await this.notificationRepository.save(notification);
            this.gateway.sendNotificationToUser(savedNotification.user_id, savedNotification);
            this.gateway.sendNotificationToAll(savedNotification);
            this.logger.log(`Notification created for user ${savedNotification.user_id}`);
            return savedNotification;
        }
        catch (error) {
            this.logger.error('Failed to create notification', error);
            throw new common_1.InternalServerErrorException('Failed to create notification');
        }
    }
    async update(notification_id, updateNotificationDto) {
        try {
            const notification = await this.findOne(notification_id);
            Object.assign(notification, updateNotificationDto);
            const updated = await this.notificationRepository.save(notification);
            this.gateway.sendNotificationToUser(updated.user_id, updated);
            this.gateway.sendNotificationToAll(updated);
            return updated;
        }
        catch (error) {
            this.logger.error(`Failed to update notification ${notification_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to update notification');
        }
    }
    async markAllAsRead(user_id) {
        try {
            await this.notificationRepository
                .createQueryBuilder()
                .update(notification_entity_1.Notification)
                .set({ read: true })
                .where('user_id = :user_id', { user_id })
                .andWhere('read = false')
                .execute();
            this.logger.log(`All notifications marked as read for user ${user_id}`);
        }
        catch (error) {
            this.logger.error(`Failed to mark all as read for user ${user_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to mark notifications as read');
        }
    }
    async findBroadcastNotifications(options = {}) {
        try {
            const { unreadOnly = false, limit = 50, page = 1 } = options;
            const query = this.notificationRepository
                .createQueryBuilder('notification')
                .where('notification.user_id IS NULL')
                .orderBy('notification.created_at', 'DESC')
                .skip((page - 1) * limit)
                .take(limit);
            if (unreadOnly) {
                query.andWhere('notification.read = false');
            }
            const [notifications, total] = await query.getManyAndCount();
            this.logger.log(`Found ${notifications.length} broadcast notifications`);
            return { notifications, total };
        }
        catch (error) {
            this.logger.error('Failed to find broadcast notifications', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve broadcast notifications');
        }
    }
    async findAllForUser(user_id, options = {}) {
        try {
            const { unreadOnly = false, limit = 50, page = 1 } = options;
            const query = this.notificationRepository
                .createQueryBuilder('notification')
                .where('(notification.user_id = :user_id OR notification.user_id IS NULL)', { user_id })
                .orderBy('notification.created_at', 'DESC')
                .skip((page - 1) * limit)
                .take(limit);
            if (unreadOnly) {
                query.andWhere('notification.read = false');
            }
            const [notifications, total] = await query.getManyAndCount();
            this.logger.log(`Found ${notifications.length} notifications for user ${user_id}`);
            return { notifications, total };
        }
        catch (error) {
            this.logger.error(`Failed to find all notifications for user ${user_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to retrieve user notifications');
        }
    }
    async markAsRead(notification_id) {
        try {
            const notification = await this.findOne(notification_id);
            notification.read = true;
            const updated = await this.notificationRepository.save(notification);
            this.gateway.sendNotificationToAll(updated);
            return updated;
        }
        catch (error) {
            this.logger.error(`Failed to mark notification ${notification_id} as read`, error);
            throw new common_1.InternalServerErrorException('Failed to mark notification as read');
        }
    }
    async getUnreadCount(user_id) {
        try {
            return await this.notificationRepository.count({
                where: { user_id, read: false },
            });
        }
        catch (error) {
            this.logger.error(`Failed to get unread count for user ${user_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to get unread count');
        }
    }
    async remove(notification_id) {
        try {
            const result = await this.notificationRepository.delete(notification_id);
            if (result.affected === 0)
                throw new common_1.NotFoundException(`Notification ${notification_id} not found`);
            this.logger.log(`Notification ${notification_id} deleted`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.logger.error(`Failed to delete notification ${notification_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to delete notification');
        }
    }
    async removeExpired() {
        try {
            const result = await this.notificationRepository
                .createQueryBuilder()
                .delete()
                .where('expires_at < :now', { now: new Date() })
                .execute();
            this.logger.log(`Removed ${result.affected ?? 0} expired notifications`);
        }
        catch (error) {
            this.logger.error('Failed to remove expired notifications', error);
            throw new common_1.InternalServerErrorException('Failed to remove expired notifications');
        }
    }
    async createMultiple(createDtos) {
        try {
            const notificationsData = createDtos.map((dto) => ({
                ...dto,
                user_id: Number(dto.userId),
                expires_at: dto.expiresAt ?? null,
            }));
            const notifications = this.notificationRepository.create(notificationsData);
            const savedNotifications = await this.notificationRepository.save(notifications);
            this.logger.log(`Created ${savedNotifications.length} notifications`);
            return savedNotifications;
        }
        catch (error) {
            this.logger.error('Failed to create multiple notifications', error);
            throw new common_1.InternalServerErrorException('Failed to create notifications');
        }
    }
    async findByUser(user_id, options = {}) {
        try {
            const { unreadOnly = false, limit = 50, page = 1 } = options;
            const query = this.notificationRepository
                .createQueryBuilder('notification')
                .where('notification.user_id = :user_id', { user_id })
                .orderBy('notification.created_at', 'DESC')
                .skip((page - 1) * limit)
                .take(limit);
            if (unreadOnly)
                query.andWhere('notification.read = false');
            const [notifications, total] = await query.getManyAndCount();
            return { notifications, total };
        }
        catch (error) {
            this.logger.error(`Failed to find notifications for user ${user_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to retrieve user notifications');
        }
    }
    async notifyUserStatusChange(userId, userName, status) {
        const notification = await this.create({
            userId,
            type: notification_entity_1.NotificationType.SYSTEM,
            title: `User ${status}`,
            message: `${userName} is now ${status}`,
            category: 'user-status',
            metadata: { userId, status },
            expiresAt: null,
        });
        this.gateway.sendNotificationToAll(notification);
    }
    async getRecentUserNotifications(user_id, hours = 24) {
        try {
            const since = new Date();
            since.setHours(since.getHours() - hours);
            return await this.notificationRepository
                .createQueryBuilder('notification')
                .where('notification.user_id = :user_id', { user_id })
                .andWhere('notification.created_at > :since', { since })
                .orderBy('notification.created_at', 'DESC')
                .getMany();
        }
        catch (error) {
            this.logger.error(`Failed to get recent notifications for user ${user_id}`, error);
            throw new common_1.InternalServerErrorException('Failed to retrieve recent notifications');
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_gateway_1.NotificationGateway))),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map