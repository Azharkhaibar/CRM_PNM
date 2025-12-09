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
    userSockets = new Map();
    logger = new common_1.Logger(NotificationGateway_1.name);
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    handleConnection(client) {
        const userId = Number(client.handshake.query.userId);
        if (userId) {
            this.registerUserSocket(userId, client);
        }
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        for (const [userId, sockets] of this.userSockets.entries()) {
            const index = sockets.indexOf(client);
            if (index !== -1) {
                sockets.splice(index, 1);
                if (sockets.length === 0) {
                    this.userSockets.delete(userId);
                    void this.triggerUserOfflineNotification(userId);
                }
                break;
            }
        }
        this.logger.log(`Client Disconnected: ${client.id}`);
    }
    async getUsername(userId) {
        const user = await this.notificationService.findByUserId(userId);
        return user?.userID ?? `User-${userId}`;
    }
    async triggerUserOfflineNotification(userId) {
        try {
            await this.notificationService.notifyUserStatusChange(userId, await this.getUsername(userId), 'offline');
            this.logger.log(`Offline notification triggered for user ${userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to trigger offline notification for user ${userId}`, error);
        }
    }
    registerUserSocket(userId, client) {
        const sockets = this.userSockets.get(userId) ?? [];
        sockets.push(client);
        this.userSockets.set(userId, sockets);
    }
    async handleGetUserNotifications(client, data) {
        try {
            const { notifications, total } = await this.notificationService.findAllForUser(data.user_id, data.options);
            client.emit('userNotifications', { notifications, total });
        }
        catch (error) {
            this.logger.error('Failed to get user notifications', error);
            client.emit('error', { message: 'Failed to get notifications' });
        }
    }
    sendNotificationToUser(userId, notification) {
        const sockets = this.userSockets.get(userId);
        if (!sockets)
            return;
        sockets.forEach((s) => s.emit('notification', notification));
    }
    sendNotificationToAll(notification) {
        this.server.emit('notification:broadcast', notification);
    }
    async handleAuthenticate(client, userId) {
        this.registerUserSocket(userId, client);
        try {
            await this.notificationService.notifyUserStatusChange(userId, await this.getUsername(userId), 'online');
        }
        catch (error) {
            this.logger.error('Failed to send online notification', error);
        }
        client.emit('authenticated', { success: true });
        this.logger.log(`User ${userId} authenticated with socket ${client.id}`);
    }
    async handleCreateNotification(client, data) {
        try {
            const notification = await this.notificationService.create(data);
            client.emit('notificationCreated', notification);
        }
        catch (error) {
            this.logger.error('Failed to create notification', error);
            client.emit('error', { message: 'Failed to create notification' });
        }
    }
    async handleUserLogout(client, userId) {
        try {
            await this.notificationService.notifyUserStatusChange(userId, await this.getUsername(userId), 'offline');
            client.emit('logoutSuccess', { success: true });
            this.logger.log(`Manual logout notification for user ${userId}`);
        }
        catch (error) {
            this.logger.error('Failed to send logout notification', error);
            client.emit('error', { message: 'Failed to process logout' });
        }
    }
    async handleUpdateNotification(client, data) {
        try {
            const updated = await this.notificationService.update(data.notification_id, data.updates);
            client.emit('notificationUpdated', updated);
        }
        catch (error) {
            this.logger.error('Failed to update notification', error);
            client.emit('error', { message: 'Failed to update notification' });
        }
    }
    async handleMarkAsRead(client, notification_id) {
        try {
            const updated = await this.notificationService.markAsRead(notification_id);
            client.emit('notificationMarkedRead', updated);
        }
        catch (error) {
            this.logger.error('Failed to mark notification as read', error);
            client.emit('error', { message: 'Failed to mark as read' });
        }
    }
    async handleMarkAllAsRead(client, user_id) {
        try {
            await this.notificationService.markAllAsRead(user_id);
            client.emit('allNotificationsMarkedRead', { success: true });
        }
        catch (error) {
            this.logger.error('Failed to mark all as read', error);
            client.emit('error', { message: 'Failed to mark all as read' });
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUserNotifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetUserNotifications", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleAuthenticate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleCreateNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userLogout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleUserLogout", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleUpdateNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAllAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMarkAllAsRead", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/notifications',
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map