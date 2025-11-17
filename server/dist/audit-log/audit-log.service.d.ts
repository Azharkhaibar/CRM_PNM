import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { User } from '../users/entities/user.entity';
export declare class AuditLogService {
    private readonly auditLogRepository;
    private readonly logger;
    constructor(auditLogRepository: Repository<AuditLog>);
    create(auditLogData: CreateAuditLogDto): Promise<AuditLog>;
    findAll(query: AuditLogQueryDto): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllWithUser(query: AuditLogQueryDto): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        today: any[];
        week: any[];
        month: any[];
        modules: any[];
    }>;
    exportToExcel(query: AuditLogQueryDto): Promise<AuditLog[]>;
    delete(id: number): Promise<{
        message: string;
    }>;
    deleteMultiple(ids: number[]): Promise<{
        message: string;
        deletedCount: number;
    }>;
    deleteAll(): Promise<{
        message: string;
        deletedCount: number;
    }>;
    deleteByFilter(filters: {
        start_date?: string;
        end_date?: string;
        action?: string;
        module?: string;
    }): Promise<{
        message: string;
        deletedCount: number;
    }>;
    checkUserRelation(): Promise<AuditLog | null>;
    getLogsWithUserInfo(query: AuditLogQueryDto): Promise<{
        data: AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserDisplayName(user: User | null): string;
    getUserRoleDisplay(user: User | null): string;
}
