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
var NotificationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const notification_gateway_1 = require("./notification.gateway");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const user_status_dto_1 = require("./dto/user-status.dto");
const get_user_decorator_1 = require("./decorator/get-user.decorator");
let NotificationController = NotificationController_1 = class NotificationController {
    notificationService;
    notificationGateway;
    logger = new common_1.Logger(NotificationController_1.name);
    constructor(notificationService, notificationGateway) {
        this.notificationService = notificationService;
        this.notificationGateway = notificationGateway;
    }
    async findAll() {
        this.logger.log('Fetching all notifications');
        return await this.notificationService.findAll();
    }
    async getMyNotifications(userId, unreadOnly, limit, page) {
        this.logger.log(`Fetching notifications for user ${userId}`);
        return await this.notificationService.findAllForUser(userId, {
            unreadOnly: unreadOnly === 'true',
            limit,
            page,
        });
    }
    async findByUser(user_id, unreadOnly, limit, page) {
        this.logger.log(`Fetching personal notifications for user ${user_id}`);
        return await this.notificationService.findByUser(user_id, {
            unreadOnly: unreadOnly === 'true',
            limit,
            page,
        });
    }
    async getAllForUser(user_id, unreadOnly, limit, page) {
        this.logger.log(`Fetching all notifications for user ${user_id}`);
        return await this.notificationService.findAllForUser(user_id, {
            unreadOnly: unreadOnly === 'true',
            limit,
            page,
        });
    }
    async getUnreadCount(user_id) {
        this.logger.log(`Fetching unread count for user ${user_id}`);
        const count = await this.notificationService.getUnreadCount(user_id);
        return { count };
    }
    async getBroadcastNotifications(unreadOnly, limit, page) {
        this.logger.log('Fetching broadcast notifications');
        return await this.notificationService.findBroadcastNotifications({
            unreadOnly: unreadOnly === 'true',
            limit,
            page,
        });
    }
    async findOne(id) {
        this.logger.log(`Fetching notification ${id}`);
        return await this.notificationService.findOne(id);
    }
    async create(userId, createNotificationDto) {
        this.logger.log(`Creating notification for user ${userId}`);
        this.logger.debug('Incoming DTO:', {
            dto: createNotificationDto,
            metadata: createNotificationDto.metadata,
            hasMetadata: !!createNotificationDto.metadata,
            metadataType: typeof createNotificationDto.metadata,
        });
        const dto = {
            ...createNotificationDto,
            user_id: createNotificationDto.user_id || userId,
        };
        const notification = await this.notificationService.create(dto);
        this.logger.debug('Created notification:', {
            notificationId: notification.notification_id,
            metadata: notification.metadata,
            hasMetadata: !!notification.metadata,
        });
        if (notification.user_id) {
            this.notificationGateway.sendNotificationToUser(notification.user_id, notification);
        }
        else {
            this.notificationGateway.sendNotificationToAll(notification);
        }
        return notification;
    }
    async createMultiple(createNotificationDtos) {
        this.logger.log(`Creating ${createNotificationDtos.length} notifications`);
        const notifications = await this.notificationService.createMultiple(createNotificationDtos);
        notifications.forEach((notification) => {
            if (notification.user_id) {
                this.notificationGateway.sendNotificationToUser(notification.user_id, notification);
            }
            else {
                this.notificationGateway.sendNotificationToAll(notification);
            }
        });
        return notifications;
    }
    async broadcast(dto) {
        this.logger.log('Creating broadcast notification');
        const notification = await this.notificationService.create(dto);
        this.notificationGateway.sendNotificationToAll(notification);
        return notification;
    }
    async userStatusNotification(userStatusDto) {
        this.logger.log(`User status change: ${userStatusDto.userName} is ${userStatusDto.status}`);
        const notification = await this.notificationService.create({
            user_id: null,
            type: 'SYSTEM',
            title: 'User Status Update',
            message: `${userStatusDto.userName} is now ${userStatusDto.status}`,
            category: 'user-status',
            metadata: {
                userId: userStatusDto.userId,
                userName: userStatusDto.userName,
                status: userStatusDto.status,
                timestamp: new Date(),
                isStatusUpdate: true,
            },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        this.notificationGateway.broadcastUserStatus(userStatusDto.userId, userStatusDto.status);
        this.notificationGateway.sendNotificationToAll(notification);
        return notification;
    }
    async update(id, updateNotificationDto) {
        this.logger.log(`Updating notification ${id}`);
        const updated = await this.notificationService.update(id, updateNotificationDto);
        if (updated.user_id) {
            this.notificationGateway.sendNotificationToUser(updated.user_id, updated);
        }
        else {
            this.notificationGateway.sendNotificationToAll(updated);
        }
        return updated;
    }
    async markAsRead(userId, id) {
        this.logger.log(`Marking notification ${id} as read by user ${userId}`);
        const notification = await this.notificationService.findOne(id);
        if (notification.user_id !== userId) {
            throw new common_1.NotFoundException('Notification not found');
        }
        const updated = await this.notificationService.markAsRead(id);
        if (updated.user_id) {
            this.notificationGateway.sendNotificationToUser(updated.user_id, updated);
        }
        return updated;
    }
    async markAllAsRead(userId) {
        this.logger.log(`Marking all notifications as read for user ${userId}`);
        await this.notificationService.markAllAsRead(userId);
        return {
            success: true,
            message: 'All notifications marked as read',
            user_id: userId,
        };
    }
    async getRecentUserNotifications(user_id, hours) {
        this.logger.log(`Fetching recent notifications for user ${user_id} (last ${hours}h)`);
        return await this.notificationService.getRecentUserNotifications(user_id, hours);
    }
    async remove(id) {
        this.logger.log(`Deleting notification ${id}`);
        await this.notificationService.remove(id);
        return {
            success: true,
            message: 'Notification deleted successfully',
            notification_id: id,
        };
    }
    async removeExpired() {
        this.logger.log('Removing expired notifications');
        await this.notificationService.removeExpired();
        return {
            success: true,
            message: 'Expired notifications removed successfully',
        };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, get_user_decorator_1.GetUser)('user_id')),
    __param(1, (0, common_1.Query)('unreadOnly')),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Get)('user/:user_id'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('unreadOnly')),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('user/:user_id/all'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('unreadOnly')),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getAllForUser", null);
__decorate([
    (0, common_1.Get)('user/:user_id/unread-count'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)('broadcast'),
    __param(0, (0, common_1.Query)('unreadOnly')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getBroadcastNotifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)('user_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createMultiple", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Post)('user-status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_status_dto_1.UserStatusDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "userStatusNotification", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, get_user_decorator_1.GetUser)('user_id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    __param(0, (0, get_user_decorator_1.GetUser)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)('user/:user_id/recent'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('hours', new common_1.DefaultValuePipe(24), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getRecentUserNotifications", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('cleanup/expired'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "removeExpired", null);
exports.NotificationController = NotificationController = NotificationController_1 = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(1, (0, common_1.Inject)(notification_gateway_1.NotificationGateway)),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        notification_gateway_1.NotificationGateway])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map