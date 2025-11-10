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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const get_user_decorator_1 = require("./decorator/get-user.decorator");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getMyNotifications(userID, unreadOnly, limit, page) {
        const user_id = Number(userID);
        return await this.notificationService.findByUser(user_id, {
            unreadOnly,
            limit,
            page,
        });
    }
    async getMyUnreadCount(userID) {
        const user_id = Number(userID);
        const count = await this.notificationService.getUnreadCount(user_id);
        return { count };
    }
    async markAsRead(id) {
        return await this.notificationService.markAsRead(id);
    }
    async markAllAsRead(userID) {
        const user_id = Number(userID);
        await this.notificationService.markAllAsRead(user_id);
        return { message: 'All notifications marked as read' };
    }
    async remove(id) {
        await this.notificationService.remove(id);
        return { message: 'Notification deleted' };
    }
    async create(dto) {
        return await this.notificationService.create(dto);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, get_user_decorator_1.GetUser)('userID')),
    __param(1, (0, common_1.Query)('unreadOnly', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Get)('my/unread-count'),
    __param(0, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getMyUnreadCount", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('mark-all-read'),
    __param(0, (0, get_user_decorator_1.GetUser)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map