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
let NotificationService = NotificationService_1 = class NotificationService {
    notificationRepo;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async findAll() {
        return this.notificationRepo.find({
            order: { created_at: 'DESC' },
        });
    }
    async findOne(notification_id) {
        const notification = await this.notificationRepo.findOne({
            where: { notification_id },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${notification_id} not found`);
        }
        return notification;
    }
    async create(crDto) {
        try {
            const notificationData = {
                ...crDto,
                user_id: Number(crDto.userId),
                expires_at: crDto.expiresAt ?? null,
            };
            delete notificationData.userId;
            delete notificationData.expiresAt;
            const notif = this.notificationRepo.create(notificationData);
            const saved = await this.notificationRepo.save(notif);
            this.logger.log(`✅ Notification created for user ${crDto.userId}`);
            return saved;
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error('❌ Failed to create notification', err.message);
            }
            else {
                this.logger.error('❌ Unknown error creating notification');
            }
            throw new common_1.InternalServerErrorException('Gagal membuat notifikasi');
        }
    }
    async update(notification_id, updateNotificationDto) {
        const notification = await this.findOne(notification_id);
        Object.assign(notification, updateNotificationDto);
        return await this.notificationRepo.save(notification);
    }
    async markAllAsRead(user_id) {
        await this.notificationRepo
            .createQueryBuilder()
            .update(notification_entity_1.Notification)
            .set({ read: true })
            .where('user_id = :user_id', { user_id })
            .andWhere('read = false')
            .execute();
        this.logger.log(`✅ All notifications marked as read for user ${user_id}`);
    }
    async createMultiple(crDto) {
        try {
            const notificationsData = crDto.map((dto) => {
                const item = {
                    ...dto,
                    user_id: Number(dto.userId),
                    expires_at: dto.expiresAt ?? null,
                };
                delete item.userId;
                delete item.expiresAt;
                return item;
            });
            const notifEntities = this.notificationRepo.create(notificationsData);
            const saved = await this.notificationRepo.save(notifEntities);
            this.logger.log(`✅ Created ${saved.length} notifications`);
            return saved;
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error('❌ Failed to create notifications', err.message);
            }
            else {
                this.logger.error('❌ Unknown error creating multiple notifications');
            }
            throw new common_1.InternalServerErrorException('Gagal membuat notifikasi');
        }
    }
    async findByUser(user_id, options) {
        const { unreadOnly = false, limit = 50, page = 1 } = options || {};
        const query = this.notificationRepo
            .createQueryBuilder('notification')
            .where('notification.user_id = :user_id', { user_id })
            .orderBy('notification.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (unreadOnly) {
            query.andWhere('notification.read = false');
        }
        const [notifications, total] = await query.getManyAndCount();
        return { notifications, total };
    }
    async markAsRead(notification_id) {
        const notification = await this.findOne(notification_id);
        notification.read = true;
        return await this.notificationRepo.save(notification);
    }
    async getUnreadCount(user_id) {
        return await this.notificationRepo.count({
            where: { user_id, read: false },
        });
    }
    async remove(notification_id) {
        const result = await this.notificationRepo.delete(notification_id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Notification with ID ${notification_id} not found`);
        }
    }
    async removeExpired() {
        const result = await this.notificationRepo
            .createQueryBuilder()
            .delete()
            .where('expires_at < :now', { now: new Date() })
            .execute();
        this.logger.log(`🗑️ Removed ${result.affected ?? 0} expired notifications`);
    }
    async getRecentUserNotifications(user_id, hours = 24) {
        const since = new Date();
        since.setHours(since.getHours() - hours);
        return await this.notificationRepo
            .createQueryBuilder('notification')
            .where('notification.user_id = :user_id', { user_id })
            .andWhere('notification.created_at > :since', { since })
            .orderBy('notification.created_at', 'DESC')
            .getMany();
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map