import { Repository } from 'typeorm';
import { RiskProfileRepositoryView } from './entities/resiko-profile-repository.entity';
import { IRiskProfileRepositoryService, RepositoryFilters, PaginationOptions, RepositoryResponse, RepositoryStatistics } from './interfaces/risk-profile-repository.interface';
import { ModuleType, Quarter } from './entities/resiko-profile-repository.entity';
export declare class ResikoProfileRepositoryService implements IRiskProfileRepositoryService {
    private readonly repositoryView;
    constructor(repositoryView: Repository<RiskProfileRepositoryView>);
    getRepositoryData(filters: RepositoryFilters, pagination: PaginationOptions): Promise<RepositoryResponse>;
    getRepositoryDataByModule(module: ModuleType, filters: RepositoryFilters, pagination: PaginationOptions): Promise<RepositoryResponse>;
    searchRepositoryData(query: string, filters: RepositoryFilters, pagination: PaginationOptions): Promise<RepositoryResponse>;
    getRepositoryStatistics(year: number, quarter: Quarter): Promise<RepositoryStatistics>;
    exportRepositoryData(filters: RepositoryFilters, format: 'excel' | 'pdf' | 'csv'): Promise<Buffer>;
    getAvailablePeriods(): Promise<{
        year: number;
        quarters: Quarter[];
    }[]>;
    debugModuleData(module: ModuleType, year?: number, quarter?: string): Promise<any>;
    private transformToDto;
    private calculateStatistics;
    private groupByModule;
    private groupByQuarter;
    private getEmptyStatistics;
    private getModuleName;
    private exportToCsv;
}
