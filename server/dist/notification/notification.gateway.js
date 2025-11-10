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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const notification_service_1 = require("./notification.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const common_1 = require("@nestjs/common");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    notificationService;
    server;
    logger = new common_1.Logger(NotificationGateway_1.name);
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async findAll() {
        try {
            const notifications = await this.notificationService.findAll();
            return { event: 'findAllNotification', data: notifications };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to fetch notifications';
            this.logger.error(`Error in findAllNotification: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async findOne(data) {
        try {
            const notification = await this.notificationService.findOne(Number(data.notification_id));
            return { event: 'findOneNotification', data: notification };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Notification not found';
            this.logger.error(`Error in findOneNotification: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async update(updateData) {
        try {
            const notification = await this.notificationService.update(Number(updateData.notification_id), updateData.data);
            return { event: 'updateNotification', data: notification };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to update notification';
            this.logger.error(`Error in updateNotification: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async remove(data) {
        try {
            await this.notificationService.remove(Number(data.notification_id));
            return { event: 'removeNotification', data: { success: true } };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to remove notification';
            this.logger.error(`Error in removeNotification: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async markAsRead(data) {
        try {
            const notification = await this.notificationService.markAsRead(Number(data.notification_id));
            return { event: 'markAsRead', data: notification };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to mark notification as read';
            this.logger.error(`Error in markAsRead: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async create(createNotificationDto) {
        try {
            const notification = await this.notificationService.create(createNotificationDto);
            const userId = Number(createNotificationDto.userId);
            this.server.emit(`user-${userId}`, {
                event: 'newNotification',
                data: notification,
            });
            return { event: 'createNotification', data: notification };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to create notification';
            this.logger.error(`Error in createNotification: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async getUserNotifications(data) {
        try {
            const user_id = Number(data.userId);
            const result = await this.notificationService.findByUser(user_id, {
                unreadOnly: data.unreadOnly,
            });
            return { event: 'getUserNotifications', data: result };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to fetch user notifications';
            this.logger.error(`Error in getUserNotifications: ${message}`);
            return { event: 'error', data: message };
        }
    }
    async getUnreadCount(data) {
        try {
            const user_id = Number(data.userId);
            const count = await this.notificationService.getUnreadCount(user_id);
            return { event: 'getUnreadCount', data: { count } };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get unread count';
            this.logger.error(`Error in getUnreadCount: ${message}`);
            return { event: 'error', data: message };
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneNotification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateNotification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeNotification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "remove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "markAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createNotification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUserNotifications'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "getUserNotifications", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUnreadCount'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "getUnreadCount", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map