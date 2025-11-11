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
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const notification_service_1 = require("./notification.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
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
    async sendNotificationToUser(userId, notification) {
        this.server.to(`user-${userId}`).emit('notification', notification);
    }
    handleJoinUser(client, userId) {
        client.join(`user-${userId}`);
        console.log(`👤 User ${userId} joined their room`);
    }
    async handleGetAllNotifications(client) {
        try {
            const notifications = await this.notificationService.findAll();
            client.emit('allNotifications', notifications);
        }
        catch (error) {
            this.logger.error('Failed to fetch all notifications', error);
            client.emit('error', { message: 'Failed to fetch notifications' });
        }
    }
    async handleGetNotification(client, data) {
        try {
            const notification = await this.notificationService.findOne(data.notification_id);
            client.emit('notification', notification);
        }
        catch (error) {
            this.logger.error(`Failed to fetch notification ${data.notification_id}`, error);
            client.emit('error', { message: 'Failed to fetch notification' });
        }
    }
    async handleUpdateNotification(client, data) {
        try {
            const notification = await this.notificationService.update(data.notification_id, data.updates);
            client.emit('notificationUpdated', notification);
            this.server.emit('notificationChanged', notification);
        }
        catch (error) {
            this.logger.error(`Failed to update notification ${data.notification_id}`, error);
            client.emit('error', { message: 'Failed to update notification' });
        }
    }
    async handleDeleteNotification(client, data) {
        try {
            await this.notificationService.remove(Number(data.notification_id));
            client.emit('notificationDeleted', {
                notification_id: data.notification_id,
            });
            this.server.emit('notificationChanged', {
                notification_id: data.notification_id,
            });
        }
        catch (error) {
            this.logger.error(`Failed to delete notification ${data.notification_id}`, error);
            client.emit('error', { message: 'Failed to delete notification' });
        }
    }
    async handleMarkAsRead(client, data) {
        try {
            const notification = await this.notificationService.markAsRead(data.notification_id);
            client.emit('notificationRead', notification);
            this.server.emit('notificationChanged', notification);
        }
        catch (error) {
            this.logger.error(`Failed to mark notification ${data.notification_id} as read`, error);
            client.emit('error', { message: 'Failed to mark notification as read' });
        }
    }
    async handleCreateNotification(client, data) {
        try {
            const notification = await this.notificationService.create(data);
            client.emit('notificationCreated', notification);
            this.server.emit('notificationChanged', notification);
        }
        catch (error) {
            this.logger.error('Failed to create notification', error);
            client.emit('error', { message: 'Failed to create notification' });
        }
    }
    async handleGetUserNotifications(client, data) {
        try {
            const result = await this.notificationService.findByUser(data.user_id, {
                unreadOnly: data.unreadOnly,
                limit: data.limit,
                page: data.page,
            });
            client.emit('userNotifications', result);
        }
        catch (error) {
            this.logger.error(`Failed to fetch notifications for user ${data.user_id}`, error);
            client.emit('error', { message: 'Failed to fetch user notifications' });
        }
    }
    async handleGetUnreadCount(client, data) {
        try {
            const count = await this.notificationService.getUnreadCount(data.user_id);
            client.emit('unreadCount', { count });
        }
        catch (error) {
            this.logger.error(`Failed to get unread count for user ${data.user_id}`, error);
            client.emit('error', { message: 'Failed to get unread count' });
        }
    }
    async broadcastToUser(user_id, event, data) {
        this.server.to(`user_${user_id}`).emit(event, data);
    }
    handleJoinUserRoom(client, data) {
        client.join(`user_${data.user_id}`);
        this.logger.log(`Client ${client.id} joined user room ${data.user_id}`);
    }
    handleLeaveUserRoom(client, data) {
        client.leave(`user_${data.user_id}`);
        this.logger.log(`Client ${client.id} left user room ${data.user_id}`);
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleJoinUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getAllNotifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetAllNotifications", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleUpdateNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleDeleteNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleCreateNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUserNotifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetUserNotifications", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUnreadCount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetUnreadCount", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinUserRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleJoinUserRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveUserRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleLeaveUserRoom", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/notifications',
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map