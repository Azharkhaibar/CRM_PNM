import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from '../audit-log.service';
import { ActionType, ModuleType } from '../entities/audit-log.entity';
import type { Request } from 'express';

interface SafeUser {
  user_id: number;
  role?: string;
  userID?: string;
}
interface SafeError {
  message?: string;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  private readonly SKIP_PATTERNS = [
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

  private readonly EXCLUDED_METHODS = ['GET', 'OPTIONS', 'HEAD'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const url: string = req.originalUrl ?? req.url ?? '-';
    const method: string = req.method ?? 'GET';

    console.log(`🔍 [INTERCEPTOR DEBUG] Checking: ${method} ${url}`);

    if (this.shouldSkipLogging(method, url)) {
      console.log(`🚫 [INTERCEPTOR DEBUG] SKIPPED: ${method} ${url}`);
      return next.handle();
    }

    console.log(`✅ [INTERCEPTOR DEBUG] PROCESSING: ${method} ${url}`);

    const user = req.user as SafeUser | undefined;

    let userId: number | null = null;
    if (user?.user_id != null) {
      userId = user.user_id;
    } else if (user?.userID != null) {
      const parsed = parseInt(user.userID, 10);
      userId = Number.isNaN(parsed) ? null : parsed;
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
      req.ip ??
      req.socket?.remoteAddress ??
      '-';

    return next.handle().pipe(
      tap(() => {
        console.log(
          `📝 [INTERCEPTOR DEBUG] Creating SUCCESS log for: ${method} ${url}`,
        );
        void this.createAuditLog({
          userId,
          method,
          url,
          ip,
          isSuccess: true,
        });
      }),

      catchError((err: unknown) => {
        const safeError = err as SafeError;

        console.log(
          `📝 [INTERCEPTOR DEBUG] Creating ERROR log for: ${method} ${url}`,
        );
        void this.createAuditLog({
          userId,
          method,
          url,
          ip,
          isSuccess: false,
          description: safeError?.message ?? 'Request failed',
        });

        return throwError(() => err);
      }),
    );
  }

  private shouldSkipLogging(method: string, url: string): boolean {
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

  private async createAuditLog(data: {
    userId: number | null;
    method: string;
    url: string;
    ip: string;
    isSuccess: boolean;
    description?: string;
  }): Promise<void> {
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
    } catch (error) {
      console.error('❌ [INTERCEPTOR] Failed to write audit log:', error);
    }
  }

  private getActionFromMethod(method: string): ActionType {
    const map: Record<string, ActionType> = {
      GET: ActionType.VIEW,
      POST: ActionType.CREATE,
      PUT: ActionType.UPDATE,
      PATCH: ActionType.UPDATE,
      DELETE: ActionType.DELETE,
    };
    return map[method.toUpperCase()] ?? ActionType.VIEW;
  }

  private getModuleFromUrl(url: string): ModuleType {
    const lower = url.toLowerCase();

    if (lower.includes('investasi') || lower.includes('investment'))
      return ModuleType.INVESTASI;
    if (lower.includes('market') || lower.includes('pasar'))
      return ModuleType.PASAR;
    if (lower.includes('likuiditas') || lower.includes('liquidity'))
      return ModuleType.LIKUIDITAS;
    if (lower.includes('operasional') || lower.includes('operational'))
      return ModuleType.OPERASIONAL;
    if (lower.includes('hukum') || lower.includes('legal'))
      return ModuleType.HUKUM;
    if (
      lower.includes('strategi') ||
      lower.includes('stratejik') ||
      lower.includes('strategic')
    )
      return ModuleType.STRATEJIK;
    if (lower.includes('kepatuhan') || lower.includes('compliance'))
      return ModuleType.KEPATUHAN;
    if (lower.includes('reputasi') || lower.includes('reputation'))
      return ModuleType.REPUTASI;
    if (
      lower.includes('user') ||
      lower.includes('auth') ||
      lower.includes('login') ||
      lower.includes('register')
    )
      return ModuleType.USER_MANAGEMENT;
    if (lower.includes('audit') || lower.includes('log'))
      return ModuleType.SYSTEM;

    return ModuleType.SYSTEM;
  }
}
