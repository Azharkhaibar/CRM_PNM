import { ResikoProfileRepositoryService } from './resiko-profile-repository.service';
import { RepositoryResponse, RepositoryStatistics } from './interfaces/risk-profile-repository.interface';
import { ModuleType, Quarter } from './entities/resiko-profile-repository.entity';
export declare class ResikoProfileRepositoryController {
    private readonly resikoProfileRepositoryService;
    constructor(resikoProfileRepositoryService: ResikoProfileRepositoryService);
    getRepositoryData(year?: number, quarter?: Quarter, moduleTypes?: ModuleType[], searchQuery?: string, page?: number, limit?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<RepositoryResponse>;
    getRepositoryDataByModule(module: ModuleType, year?: number, quarter?: Quarter, searchQuery?: string, page?: number, limit?: number): Promise<RepositoryResponse>;
    searchRepositoryData(query: string, year?: number, quarter?: Quarter, moduleTypes?: ModuleType[], page?: number, limit?: number): Promise<RepositoryResponse>;
    getRepositoryStatistics(year: number, quarter: Quarter): Promise<RepositoryStatistics>;
    exportRepositoryData(year?: number, quarter?: Quarter, moduleTypes?: ModuleType[]): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        contentType: string;
        filename: string;
    }>;
    getAvailableModules(): {
        modules: {
            code: ModuleType;
            name: string;
            color: string;
        }[];
    };
    getAvailablePeriods(): Promise<{
        year: number;
        quarters: Quarter[];
    }[]>;
    private getModuleName;
    private getModuleColor;
}
