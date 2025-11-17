import express from 'express';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    create(dto: CreateAuditLogDto, req: express.Request): Promise<import("./entities/audit-log.entity").AuditLog>;
    findAll(query: AuditLogQueryDto): Promise<{
        data: import("./entities/audit-log.entity").AuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    testRelation(): Promise<import("./entities/audit-log.entity").AuditLog | null>;
    getStats(): Promise<{
        today: any[];
        week: any[];
        month: any[];
        modules: any[];
    }>;
    exportToExcel(query: AuditLogQueryDto, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteAuditLog(id: number): Promise<{
        message: string;
    }>;
    deleteMultipleAuditLogs(body: {
        ids: number[];
    }): Promise<{
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
    deleteAllAuditLogs(): Promise<{
        message: string;
        deletedCount: number;
    }>;
}
