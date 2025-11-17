import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditLogService } from '../audit-log.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    private readonly SKIP_PATTERNS;
    private readonly EXCLUDED_METHODS;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private shouldSkipLogging;
    private createAuditLog;
    private getActionFromMethod;
    private getModuleFromUrl;
}
