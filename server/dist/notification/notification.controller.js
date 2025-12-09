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
const create_notification_dto_1 = require("./dto/create-notification.dto");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const user_status_dto_1 = require("./dto/user-status.dto");
const notification_gateway_1 = require("./notification.gateway");
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
    async create(createNotificationDto) {
        this.logger.log('Creating new notification');
        return await this.notificationService.create(createNotificationDto);
    }
    async createMultiple(createNotificationDtos) {
        this.logger.log(`Creating ${createNotificationDtos.length} notifications`);
        return await this.notificationService.createMultiple(createNotificationDtos);
    }
    async broadcast(dto) {
        const saved = await this.notificationService.create(dto);
        this.notificationGateway.sendNotificationToAll(saved);
        return saved;
    }
    async userStatusNotification(userStatusDto) {
        this.logger.log(`User status change: ${userStatusDto.userName} is ${userStatusDto.status}`);
        return await this.notificationService.notifyUserStatusChange(userStatusDto.userId, userStatusDto.userName, userStatusDto.status);
    }
    async update(id, updateNotificationDto) {
        this.logger.log(`Updating notification ${id}`);
        return await this.notificationService.update(id, updateNotificationDto);
    }
    async markAsRead(id) {
        this.logger.log(`Marking notification ${id} as read`);
        return await this.notificationService.markAsRead(id);
    }
    async markAllAsRead(user_id) {
        this.logger.log(`Marking all notifications as read for user ${user_id}`);
        await this.notificationService.markAllAsRead(user_id);
        return {
            success: true,
            message: 'All notifications marked as read',
            user_id,
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
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
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('user/:user_id/mark-all-read'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
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
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        notification_gateway_1.NotificationGateway])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map