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
let NotificationController = NotificationController_1 = class NotificationController {
    notificationService;
    logger = new common_1.Logger(NotificationController_1.name);
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async findAll() {
        this.logger.log('Fetching all notifications');
        return await this.notificationService.findAll();
    }
    async findByUser(user_id, unreadOnly, limit, page) {
        this.logger.log(`Fetching notifications for user ${user_id}`);
        return await this.notificationService.findByUser(Number(user_id), {
            unreadOnly: unreadOnly === 'true',
            limit: limit ? Number(limit) : undefined,
            page: page ? Number(page) : undefined,
        });
    }
    async getUnreadCount(user_id) {
        this.logger.log(`Fetching unread count for user ${user_id}`);
        const count = await this.notificationService.getUnreadCount(Number(user_id));
        return { count };
    }
    async findOne(id) {
        this.logger.log(`Fetching notification ${id}`);
        return await this.notificationService.findOne(Number(id));
    }
    async create(createNotificationDto) {
        this.logger.log('Creating new notification');
        return await this.notificationService.create(createNotificationDto);
    }
    async update(id, updateNotificationDto) {
        this.logger.log(`Updating notification ${id}`);
        return await this.notificationService.update(Number(id), updateNotificationDto);
    }
    async markAsRead(id) {
        this.logger.log(`Marking notification ${id} as read`);
        return await this.notificationService.markAsRead(Number(id));
    }
    async markAllAsRead(user_id) {
        this.logger.log(`Marking all notifications as read for user ${user_id}`);
        await this.notificationService.markAllAsRead(Number(user_id));
        return { message: 'All notifications marked as read' };
    }
    async remove(id) {
        this.logger.log(`Deleting notification ${id}`);
        await this.notificationService.remove(Number(id));
        return { message: 'Notification deleted successfully' };
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
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Query)('unreadOnly')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('user/:user_id/unread-count'),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
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
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('user/:user_id/mark-all-read'),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
exports.NotificationController = NotificationController = NotificationController_1 = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map