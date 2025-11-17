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
var AuditLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let AuditLogService = AuditLogService_1 = class AuditLogService {
    auditLogRepository;
    logger = new common_1.Logger(AuditLogService_1.name);
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async create(auditLogData) {
        try {
            const { userId, ip_address, ...rest } = auditLogData;
            console.log('🔍 [BACKEND] Menerima audit log:', auditLogData);
            console.log('🔍 [BACKEND] UserId dari payload:', userId);
            const auditLog = this.auditLogRepository.create({
                ...rest,
                userId: userId ?? null,
                ip_address: ip_address || 'unknown',
            });
            const savedLog = await this.auditLogRepository.save(auditLog);
            console.log('✅ [BACKEND] Berhasil menyimpan audit log. UserId:', savedLog.userId);
            return savedLog;
        }
        catch (error) {
            console.error('❌ [BACKEND] Error creating audit log:', error);
            throw error;
        }
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 20, search, action, module, start_date, end_date, } = query;
            const skip = (page - 1) * limit;
            const whereConditions = {};
            if (search) {
                whereConditions.description = (0, typeorm_2.Like)(`%${search}%`);
            }
            if (action) {
                whereConditions.action = action;
            }
            if (module) {
                whereConditions.module = module;
            }
            if (start_date && end_date) {
                whereConditions.timestamp = (0, typeorm_2.Between)(new Date(start_date), new Date(`${end_date}T23:59:59.999Z`));
            }
            console.log('🔍 [BACKEND] Query conditions:', whereConditions);
            const [data, total] = await this.auditLogRepository.findAndCount({
                where: whereConditions,
                relations: {
                    user: true,
                },
                order: { timestamp: 'DESC' },
                skip,
                take: limit,
            });
            console.log('🔍 [BACKEND] Audit logs loaded:', data.length);
            if (data.length > 0) {
                const sampleLog = data[0];
                console.log('🔍 [BACKEND] Sample log structure:', {
                    id: sampleLog.id,
                    userId: sampleLog.userId,
                    hasUser: !!sampleLog.user,
                    user: sampleLog.user
                        ? {
                            user_id: sampleLog.user.user_id,
                            userID: sampleLog.user.userID,
                            role: sampleLog.user.role,
                            gender: sampleLog.user.gender,
                        }
                        : 'No user',
                });
            }
            data.forEach((log, index) => {
                const user = log.user;
                console.log(`📝 Log ${index + 1}:`, {
                    id: log.id,
                    userId: log.userId,
                    hasUser: !!user,
                    user_id: user?.user_id,
                    userID: user?.userID,
                    role: user?.role,
                    gender: user?.gender,
                });
            });
            return {
                data,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logger.error('Error finding audit logs:', error);
            throw error;
        }
    }
    async findAllWithUser(query) {
        try {
            const { page = 1, limit = 20, search, action, module, start_date, end_date, } = query;
            const skip = (page - 1) * limit;
            const queryBuilder = this.auditLogRepository
                .createQueryBuilder('audit_log')
                .leftJoinAndSelect('audit_log.user', 'user')
                .select([
                'audit_log',
                'user.user_id',
                'user.userID',
                'user.role',
                'user.gender',
            ])
                .orderBy('audit_log.timestamp', 'DESC')
                .skip(skip)
                .take(limit);
            if (search) {
                queryBuilder.where('audit_log.description LIKE :search', {
                    search: `%${search}%`,
                });
            }
            if (action) {
                if (search) {
                    queryBuilder.andWhere('audit_log.action = :action', { action });
                }
                else {
                    queryBuilder.where('audit_log.action = :action', { action });
                }
            }
            if (module) {
                if (search || action) {
                    queryBuilder.andWhere('audit_log.module = :module', { module });
                }
                else {
                    queryBuilder.where('audit_log.module = :module', { module });
                }
            }
            if (start_date && end_date) {
                const startDate = new Date(start_date);
                const endDate = new Date(`${end_date}T23:59:59.999Z`);
                if (search || action || module) {
                    queryBuilder.andWhere('audit_log.timestamp BETWEEN :start AND :end', {
                        start: startDate,
                        end: endDate,
                    });
                }
                else {
                    queryBuilder.where('audit_log.timestamp BETWEEN :start AND :end', {
                        start: startDate,
                        end: endDate,
                    });
                }
            }
            const [data, total] = await queryBuilder.getManyAndCount();
            console.log('🔍 [BACKEND] Enhanced query - Audit logs loaded:', data.length);
            if (data.length > 0) {
                const firstLog = data[0];
                console.log('🔍 [BACKEND] First log with user:', {
                    id: firstLog.id,
                    userId: firstLog.userId,
                    hasUser: !!firstLog.user,
                    user: firstLog.user
                        ? {
                            user_id: firstLog.user.user_id,
                            userID: firstLog.user.userID,
                            role: firstLog.user.role,
                            gender: firstLog.user.gender,
                        }
                        : null,
                });
            }
            return {
                data,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logger.error('Error finding audit logs with user:', error);
            throw error;
        }
    }
    async getStats() {
        try {
            const now = new Date();
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);
            const endOfToday = new Date(now);
            endOfToday.setHours(23, 59, 59, 999);
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const todayStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('audit_log.action', 'action')
                .addSelect('COUNT(*)', 'count')
                .where('audit_log.timestamp BETWEEN :start AND :end', {
                start: startOfToday,
                end: endOfToday,
            })
                .groupBy('audit_log.action')
                .getRawMany();
            const weekStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('audit_log.action', 'action')
                .addSelect('COUNT(*)', 'count')
                .where('audit_log.timestamp BETWEEN :start AND :end', {
                start: startOfWeek,
                end: endOfToday,
            })
                .groupBy('audit_log.action')
                .getRawMany();
            const monthStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('audit_log.action', 'action')
                .addSelect('COUNT(*)', 'count')
                .where('audit_log.timestamp BETWEEN :start AND :end', {
                start: startOfMonth,
                end: endOfToday,
            })
                .groupBy('audit_log.action')
                .getRawMany();
            const modules = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('DISTINCT audit_log.module', 'module')
                .where('audit_log.module IS NOT NULL')
                .getRawMany();
            return {
                today: todayStats,
                week: weekStats,
                month: monthStats,
                modules: modules.map((m) => m.module).filter(Boolean),
            };
        }
        catch (error) {
            this.logger.error('Error getting stats:', error);
            throw error;
        }
    }
    async exportToExcel(query) {
        try {
            const { data } = await this.findAllWithUser({ ...query, limit: 1000 });
            return data;
        }
        catch (error) {
            this.logger.error('Error exporting to excel:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            this.logger.log(`ngehapus audit log dengan ID : ${id}`);
            const auditLog = await this.auditLogRepository.findOne({
                where: { id },
            });
            if (!auditLog) {
                throw new common_1.NotFoundException(`Audit log dengan ID ${id} tidak ditemukan`);
            }
            await this.auditLogRepository.remove(auditLog);
            this.logger.log(`berhasil hapus log dengan ID : ${id}`);
            return {
                message: 'data log audit berhasil di hapus',
            };
        }
        catch (error) {
            this.logger.error(`Error deleting audit log ${id}:`, error);
            throw error;
        }
    }
    async deleteMultiple(ids) {
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new Error('ID logs tidak valid');
            }
            this.logger.log(`menghapus ${ids.length} audit logs: [${ids.join(', ')}]`);
            const auditLogs = await this.auditLogRepository.find({
                where: { id: (0, typeorm_2.In)(ids) },
            });
            if (auditLogs.length === 0) {
                throw new common_1.NotFoundException('Tidak ada audit log yang ditemukan dengan ID yang diberikan');
            }
            await this.auditLogRepository.remove(auditLogs);
            this.logger.log(`Berhasil menghapus ${auditLogs.length} audit logs`);
            return {
                message: `${auditLogs.length} audit log berhasil dihapus`,
                deletedCount: auditLogs.length,
            };
        }
        catch (error) {
            this.logger.error(`Error deleting multiple audit logs:`, error);
            throw error;
        }
    }
    async deleteAll() {
        try {
            const count = await this.auditLogRepository.count();
            if (count === 0) {
                return {
                    message: `tidak ada log audit data untuk di hapus`,
                    deletedCount: 0,
                };
            }
            await this.auditLogRepository.clear();
            this.logger.log(`berhasil menghapus semua ${count} audit logs`);
            return {
                message: `semua ${count} audit log berhasil dihapus`,
                deletedCount: count,
            };
        }
        catch (err) {
            this.logger.error('Error deleting all audit logs:', err);
            throw new Error(`Gagal menghapus semua audit logs: ${err.message}`);
        }
    }
    async deleteByFilter(filters) {
        try {
            const whereConditions = {};
            if (filters.action) {
                if (Object.values(audit_log_entity_1.ActionType).includes(filters.action)) {
                    whereConditions.action = filters.action;
                }
                else {
                    throw new Error(`Action '${filters.action}' tidak valid`);
                }
            }
            if (filters.module) {
                if (Object.values(audit_log_entity_1.ModuleType).includes(filters.module)) {
                    whereConditions.module = filters.module;
                }
                else {
                    throw new Error(`Module '${filters.module}' tidak valid`);
                }
            }
            if (filters.start_date && filters.end_date) {
                whereConditions.timestamp = (0, typeorm_2.Between)(new Date(filters.start_date), new Date(`${filters.end_date}T23:59:59.999Z`));
            }
            const auditLogs = await this.auditLogRepository.find({
                where: whereConditions,
            });
            if (auditLogs.length === 0) {
                return {
                    message: 'Tidak ada log yang sesuai dengan filter',
                    deletedCount: 0,
                };
            }
            await this.auditLogRepository.remove(auditLogs);
            this.logger.log(`Berhasil menghapus ${auditLogs.length} audit logs berdasarkan filter`);
            return {
                message: `${auditLogs.length} log berhasil dihapus berdasarkan filter`,
                deletedCount: auditLogs.length,
            };
        }
        catch (error) {
            this.logger.error('Error deleting audit logs by filter:', error);
            throw new Error(`Gagal menghapus audit logs berdasarkan filter: ${error.message}`);
        }
    }
    async checkUserRelation() {
        try {
            const testLog = await this.auditLogRepository.findOne({
                where: { userId: 1 },
                relations: {
                    user: true,
                },
            });
            console.log('🔍 [BACKEND] Relation test:', {
                hasLog: !!testLog,
                userId: testLog?.userId,
                hasUser: !!testLog?.user,
                user: testLog?.user
                    ? {
                        user_id: testLog.user.user_id,
                        userID: testLog.user.userID,
                        role: testLog.user.role,
                        gender: testLog.user.gender,
                    }
                    : null,
            });
            return testLog;
        }
        catch (error) {
            console.error('❌ [BACKEND] Relation test error:', error);
            throw error;
        }
    }
    async getLogsWithUserInfo(query) {
        try {
            const result = await this.findAllWithUser(query);
            return result;
        }
        catch (error) {
            this.logger.error('Error getting logs with user info:', error);
            throw error;
        }
    }
    getUserDisplayName(user) {
        if (!user)
            return 'System';
        if (user.userID) {
            return user.userID;
        }
        return `User ${user.user_id}`;
    }
    getUserRoleDisplay(user) {
        if (!user)
            return 'System';
        return user.role || 'User';
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = AuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map