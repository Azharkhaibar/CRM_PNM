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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const audit_log_service_1 = require("../audit-log.service");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditLogInterceptor = class AuditLogInterceptor {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    SKIP_PATTERNS = [
        '/dashboard/risk-form/investasi',
        '/dashboard/risk-form/investasi/',
        'risk-form/investasi',
        'risk-form/investasi/',
        '/risk-form/investasi',
        '/risk-form/investasi/',
        'investasi',
        'investasi/',
        '/investasi',
        '/investasi/',
        '/api/investments',
        '/api/investments/',
        'investments',
        'investments/',
        '/investments',
        '/investments/',
    ];
    EXCLUDED_METHODS = ['GET', 'OPTIONS', 'HEAD'];
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const url = req.originalUrl ?? req.url ?? '-';
        const method = req.method ?? 'GET';
        console.log(`🔍 [INTERCEPTOR DEBUG] Checking: ${method} ${url}`);
        if (this.shouldSkipLogging(method, url)) {
            console.log(`🚫 [INTERCEPTOR DEBUG] SKIPPED: ${method} ${url}`);
            return next.handle();
        }
        console.log(`✅ [INTERCEPTOR DEBUG] PROCESSING: ${method} ${url}`);
        const user = req.user;
        let userId = null;
        if (user?.user_id != null) {
            userId = user.user_id;
        }
        else if (user?.userID != null) {
            const parsed = parseInt(user.userID, 10);
            userId = Number.isNaN(parsed) ? null : parsed;
        }
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ??
            req.ip ??
            req.socket?.remoteAddress ??
            '-';
        return next.handle().pipe((0, operators_1.tap)(() => {
            console.log(`📝 [INTERCEPTOR DEBUG] Creating SUCCESS log for: ${method} ${url}`);
            void this.createAuditLog({
                userId,
                method,
                url,
                ip,
                isSuccess: true,
            });
        }), (0, operators_1.catchError)((err) => {
            const safeError = err;
            console.log(`📝 [INTERCEPTOR DEBUG] Creating ERROR log for: ${method} ${url}`);
            void this.createAuditLog({
                userId,
                method,
                url,
                ip,
                isSuccess: false,
                description: safeError?.message ?? 'Request failed',
            });
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
    shouldSkipLogging(method, url) {
        console.log(`🔍 [INTERCEPTOR DEBUG] Checking: ${method} ${url}`);
        const shouldSkip = this.SKIP_PATTERNS.some((pattern) => {
            const matches = url.includes(pattern);
            if (matches) {
                console.log(`⏩ [SKIP REASON] Pattern matched: ${url} -> ${pattern}`);
            }
            return matches;
        });
        if (shouldSkip) {
            console.log(`🚫 [INTERCEPTOR] SKIPPED: ${method} ${url}`);
            return true;
        }
        if (this.EXCLUDED_METHODS.includes(method)) {
            console.log(`⏩ [SKIP REASON] Method excluded: ${method}`);
            return true;
        }
        if (url.includes('.') && !url.includes('?')) {
            console.log(`⏩ [SKIP REASON] Static file: ${url}`);
            return true;
        }
        console.log(`✅ [INTERCEPTOR] WILL LOG: ${method} ${url}`);
        return false;
    }
    async createAuditLog(data) {
        try {
            const auditLogData = {
                userId: data.userId,
                action: this.getActionFromMethod(data.method),
                module: this.getModuleFromUrl(data.url),
                description: data.description ?? `${data.method} ${data.url}`,
                endpoint: data.url,
                ip_address: data.ip,
                isSuccess: data.isSuccess,
                metadata: {
                    method: data.method,
                    url: data.url,
                    timestamp: new Date().toISOString(),
                    source: 'interceptor',
                },
            };
            console.log('🔍 [INTERCEPTOR] Creating audit log:', auditLogData);
            await this.auditLogService.create(auditLogData);
            console.log('✅ [INTERCEPTOR] Audit log created successfully');
        }
        catch (error) {
            console.error('❌ [INTERCEPTOR] Failed to write audit log:', error);
        }
    }
    getActionFromMethod(method) {
        const map = {
            GET: audit_log_entity_1.ActionType.VIEW,
            POST: audit_log_entity_1.ActionType.CREATE,
            PUT: audit_log_entity_1.ActionType.UPDATE,
            PATCH: audit_log_entity_1.ActionType.UPDATE,
            DELETE: audit_log_entity_1.ActionType.DELETE,
        };
        return map[method.toUpperCase()] ?? audit_log_entity_1.ActionType.VIEW;
    }
    getModuleFromUrl(url) {
        const lower = url.toLowerCase();
        if (lower.includes('investasi') || lower.includes('investment'))
            return audit_log_entity_1.ModuleType.INVESTASI;
        if (lower.includes('market') || lower.includes('pasar'))
            return audit_log_entity_1.ModuleType.PASAR;
        if (lower.includes('likuiditas') || lower.includes('liquidity'))
            return audit_log_entity_1.ModuleType.LIKUIDITAS;
        if (lower.includes('operasional') || lower.includes('operational'))
            return audit_log_entity_1.ModuleType.OPERASIONAL;
        if (lower.includes('hukum') || lower.includes('legal'))
            return audit_log_entity_1.ModuleType.HUKUM;
        if (lower.includes('strategi') ||
            lower.includes('stratejik') ||
            lower.includes('strategic'))
            return audit_log_entity_1.ModuleType.STRATEJIK;
        if (lower.includes('kepatuhan') || lower.includes('compliance'))
            return audit_log_entity_1.ModuleType.KEPATUHAN;
        if (lower.includes('reputasi') || lower.includes('reputation'))
            return audit_log_entity_1.ModuleType.REPUTASI;
        if (lower.includes('user') ||
            lower.includes('auth') ||
            lower.includes('login') ||
            lower.includes('register'))
            return audit_log_entity_1.ModuleType.USER_MANAGEMENT;
        if (lower.includes('audit') || lower.includes('log'))
            return audit_log_entity_1.ModuleType.SYSTEM;
        return audit_log_entity_1.ModuleType.SYSTEM;
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptors.js.map