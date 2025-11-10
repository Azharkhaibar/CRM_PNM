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
const notification_entity_1 = require("./entities/notification.entity");
const typeorm_2 = require("typeorm");
let NotificationService = NotificationService_1 = class NotificationService {
    notificationRepo;
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    logger = new common_1.Logger(NotificationService_1.name);
    async findAll() {
        return await this.notificationRepo.find({
            order: { created_at: 'DESC' },
        });
    }
    async findOne(notification_id) {
        const notification = await this.notificationRepo.findOne({
            where: { notification_id },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    }
    async update(notification_id, updateNotificationDto) {
        await this.notificationRepo.update(notification_id, updateNotificationDto);
        return await this.findOne(notification_id);
    }
    async create(crDto) {
        try {
            const notificationData = {
                ...crDto,
                expires_at: crDto.expiresAt,
            };
            const notif = this.notificationRepo.create(notificationData);
            const sv = await this.notificationRepo.save(notif);
            this.logger.log(`Notification created for user ${crDto.userId}`);
            return sv;
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err.stack);
            }
            else {
                console.error(err);
            }
            throw new Error('gagal buat notif');
        }
    }
    async createMultiple(crDto) {
        const notificationsData = crDto.map((dto) => ({
            ...dto,
            expires_at: dto.expiresAt,
        }));
        const notif = this.notificationRepo.create(notificationsData);
        return await this.notificationRepo.save(notif);
    }
    async findByUser(userId, options) {
        const { unreadOnly = false, limit = 50, page = 1 } = options || {};
        const query = this.notificationRepo
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .orderBy('notification.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (unreadOnly) {
            query.andWhere('notification.read = :read', { read: false });
        }
        const [notifications, total] = await query.getManyAndCount();
        return { notifications, total };
    }
    async markAsRead(notification_id) {
        const notification = await this.notificationRepo.findOne({
            where: { notification_id },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.read = true;
        return await this.notificationRepo.save(notification);
    }
    async getUnreadCount(userId) {
        return await this.notificationRepo.count({
            where: { userId, read: false },
        });
    }
    async remove(notification_id) {
        await this.notificationRepo.delete(notification_id);
    }
    async removeExpired() {
        await this.notificationRepo
            .createQueryBuilder()
            .delete()
            .where('expires_at < :now', { now: new Date() })
            .execute();
    }
    async getRecentUserNotifications(userId, hours = 24) {
        const since = new Date();
        since.setHours(since.getHours() - hours);
        return await this.notificationRepo
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
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