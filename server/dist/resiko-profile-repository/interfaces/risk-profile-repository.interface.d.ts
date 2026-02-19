import { RiskProfileRepositoryDto } from '../dto/risk-profile-repository.dto';
import { ModuleType, Quarter } from '../entities/resiko-profile-repository.entity';
export interface IRiskProfileRepositoryService {
    getRepositoryData(filters: RepositoryFilters, pagination: PaginationOptions): Promise<RepositoryResponse>;
    getRepositoryDataByModule(module: ModuleType, filters: RepositoryFilters, pagination: PaginationOptions): Promise<RepositoryResponse>;
    searchRepositoryData(query: string, filters: RepositoryFilters, pagination: PaginationOptions): Promise<RepositoryResponse>;
    getRepositoryStatistics(year: number, quarter: Quarter): Promise<RepositoryStatistics>;
    exportRepositoryData(filters: RepositoryFilters, format: 'csv'): Promise<Buffer>;
    getAvailablePeriods(): Promise<{
        year: number;
        quarters: Quarter[];
    }[]>;
}
export interface RepositoryFilters {
    year?: number;
    quarter?: Quarter;
    moduleTypes?: ModuleType[];
    searchQuery?: string;
    isValidated?: boolean;
    startDate?: Date;
    endDate?: Date;
}
export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface RepositoryResponse {
    data: RiskProfileRepositoryDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    statistics: {
        totalModules: number;
        totalIndicators: number;
        totalWeighted: number;
        moduleBreakdown: {
            module: string;
            count: number;
            totalWeighted: number;
        }[];
    };
}
export interface RepositoryStatistics {
    totalModules: number;
    totalIndicators: number;
    totalWeighted: number;
    byModule: {
        module: string;
        count: number;
        totalWeighted: number;
        averageWeighted: number;
    }[];
    byQuarter: {
        quarter: string;
        count: number;
        totalWeighted: number;
    }[];
    validationStatus: {
        validated: number;
        notValidated: number;
    };
}
