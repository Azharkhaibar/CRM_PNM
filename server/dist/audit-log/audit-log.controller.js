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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = __importDefault(require("express"));
const audit_log_service_1 = require("./audit-log.service");
const create_audit_log_dto_1 = require("./dto/create-audit-log.dto");
const audit_log_query_dto_1 = require("./dto/audit-log-query.dto");
let AuditLogController = class AuditLogController {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    async create(dto, req) {
        console.log('🔍 [CONTROLLER] Creating audit log:', dto);
        let ipAddress = '';
        try {
            const forwarded = req.headers['x-forwarded-for'];
            if (typeof forwarded === 'string') {
                ipAddress = forwarded.split(',')[0].trim();
            }
            else if (Array.isArray(forwarded)) {
                ipAddress = forwarded[0];
            }
            if (!ipAddress) {
                const realIp = req.headers['x-real-ip'];
                if (typeof realIp === 'string') {
                    ipAddress = realIp;
                }
            }
            if (!ipAddress && req.socket?.remoteAddress) {
                ipAddress = req.socket.remoteAddress;
                if (ipAddress === '::1') {
                    ipAddress = '127.0.0.1';
                }
                else if (ipAddress.startsWith('::ffff:')) {
                    ipAddress = ipAddress.substring(7);
                }
            }
            if (!ipAddress) {
                ipAddress = 'unknown';
            }
            console.log('🌐 [CONTROLLER] Detected IP:', ipAddress);
        }
        catch (error) {
            console.warn('⚠️ [CONTROLLER] Error detecting IP:', error);
            ipAddress = 'unknown';
        }
        const auditLogData = {
            ...dto,
            ip_address: ipAddress,
        };
        return await this.auditLogService.create(auditLogData);
    }
    async findAll(query) {
        console.log('🔍 [CONTROLLER] Fetching audit logs with query:', query);
        const result = await this.auditLogService.getLogsWithUserInfo(query);
        console.log('✅ [CONTROLLER] Found logs:', result.total);
        console.log('✅ [CONTROLLER] Sample log user data:', result.data.length > 0
            ? {
                userId: result.data[0].userId,
                user: result.data[0].user
                    ? {
                        userID: result.data[0].user.userID,
                        role: result.data[0].user.role,
                    }
                    : 'No user',
            }
            : 'No data');
        return result;
    }
    async testRelation() {
        return await this.auditLogService.checkUserRelation();
    }
    async getStats() {
        return await this.auditLogService.getStats();
    }
    async exportToExcel(query, res) {
        try {
            const data = await this.auditLogService.exportToExcel(query);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`);
            return res.json(data);
        }
        catch (error) {
            throw new common_1.HttpException('Gagal mengekspor data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteAuditLog(id) {
        try {
            return await this.auditLogService.delete(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(error.message || 'Gagal menghapus audit log', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteMultipleAuditLogs(body) {
        try {
            if (!body.ids || !Array.isArray(body.ids)) {
                throw new common_1.HttpException('Format data tidak valid. IDs harus berupa array', common_1.HttpStatus.BAD_REQUEST);
            }
            if (body.ids.length === 0) {
                throw new common_1.HttpException('Tidak ada ID yang diberikan untuk dihapus', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.auditLogService.deleteMultiple(body.ids);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(error.message || 'Gagal menghapus audit logs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteByFilter(filters) {
        try {
            if (filters.start_date && filters.end_date) {
                const startDate = new Date(filters.start_date);
                const endDate = new Date(filters.end_date);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new common_1.HttpException('Format tanggal tidak valid', common_1.HttpStatus.BAD_REQUEST);
                }
                if (startDate > endDate) {
                    throw new common_1.HttpException('Tanggal mulai tidak boleh lebih besar dari tanggal akhir', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const convertedFilters = {
                start_date: filters.start_date,
                end_date: filters.end_date,
                action: filters.action,
                module: filters.module,
            };
            return await this.auditLogService.deleteByFilter(convertedFilters);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Gagal menghapus audit logs berdasarkan filter', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteAllAuditLogs() {
        try {
            return await this.auditLogService.deleteAll();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Gagal menghapus semua audit logs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuditLogController = AuditLogController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_audit_log_dto_1.CreateAuditLogDto, Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_query_dto_1.AuditLogQueryDto]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('test-relation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "testRelation", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_query_dto_1.AuditLogQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "deleteAuditLog", null);
__decorate([
    (0, common_1.Delete)('batch/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "deleteMultipleAuditLogs", null);
__decorate([
    (0, common_1.Delete)('filter/delete'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "deleteByFilter", null);
__decorate([
    (0, common_1.Delete)('all/delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogController.prototype, "deleteAllAuditLogs", null);
exports.AuditLogController = AuditLogController = __decorate([
    (0, common_1.Controller)('audit-logs'),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogController);
//# sourceMappingURL=audit-log.controller.js.map