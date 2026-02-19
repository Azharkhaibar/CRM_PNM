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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResikoProfileRepositoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resiko_profile_repository_entity_1 = require("./entities/resiko-profile-repository.entity");
const resiko_profile_repository_entity_2 = require("./entities/resiko-profile-repository.entity");
let ResikoProfileRepositoryService = class ResikoProfileRepositoryService {
    repositoryView;
    constructor(repositoryView) {
        this.repositoryView = repositoryView;
    }
    async getRepositoryData(filters, pagination) {
        try {
            const { page, limit, sortBy, sortOrder } = pagination;
            const skip = (page - 1) * limit;
            console.log('=== DEBUG: getRepositoryData called ===');
            console.log('Filters:', JSON.stringify(filters, null, 2));
            console.log('Pagination:', JSON.stringify(pagination, null, 2));
            const queryBuilder = this.repositoryView.createQueryBuilder('view');
            if (filters.year) {
                console.log(`Applying year filter: ${filters.year}`);
                queryBuilder.andWhere('view.year = :year', { year: filters.year });
            }
            if (filters.quarter) {
                console.log(`Applying quarter filter: ${filters.quarter}`);
                queryBuilder.andWhere('view.quarter = :quarter', {
                    quarter: filters.quarter,
                });
            }
            if (filters.moduleTypes && filters.moduleTypes.length > 0) {
                console.log(`Applying moduleTypes filter: ${filters.moduleTypes}`);
                queryBuilder.andWhere('view.moduleType IN (:...moduleTypes)', {
                    moduleTypes: filters.moduleTypes,
                });
            }
            if (filters.searchQuery) {
                console.log(`Applying search filter: ${filters.searchQuery}`);
                const searchPattern = `%${filters.searchQuery}%`;
                queryBuilder.andWhere('(view.indikator LIKE :search OR view.subNo LIKE :search OR view.sumberRisiko LIKE :search OR view.dampak LIKE :search OR view.parameter LIKE :search OR view.sectionLabel LIKE :search)', { search: searchPattern });
            }
            if (filters.isValidated !== undefined) {
                console.log(`Applying validation filter: ${filters.isValidated}`);
                queryBuilder.andWhere('view.isValidated = :isValidated', {
                    isValidated: filters.isValidated,
                });
            }
            if (filters.startDate && filters.endDate) {
                console.log(`Applying date range filter: ${filters.startDate} to ${filters.endDate}`);
                queryBuilder.andWhere('view.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
            }
            console.log('=== DEBUG: Query SQL ===');
            const sql = queryBuilder.getSql();
            console.log('SQL:', sql);
            console.log('Parameters:', queryBuilder.getParameters());
            console.log('=== DEBUG: Getting total count ===');
            const total = await queryBuilder.getCount();
            console.log('Total count:', total);
            if (sortBy) {
                const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
                queryBuilder.orderBy(`view.${sortBy}`, order);
            }
            else {
                queryBuilder
                    .orderBy('view.moduleType', 'ASC')
                    .addOrderBy('view.no', 'ASC')
                    .addOrderBy('view.subNo', 'ASC');
            }
            queryBuilder.skip(skip).take(limit);
            console.log('=== DEBUG: Executing query ===');
            const data = await queryBuilder.getMany();
            console.log('Data fetched:', data.length, 'records');
            if (data.length > 0) {
                console.log('Sample first record:', JSON.stringify(data[0], null, 2));
            }
            const transformedData = data.map((item) => this.transformToDto(item));
            const statistics = this.calculateStatistics(data);
            console.log('=== DEBUG: Returning response ===');
            return {
                data: transformedData,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                statistics,
            };
        }
        catch (error) {
            console.error('=== ERROR DETAIL in getRepositoryData ===');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Full error:', error);
            if (error.message.includes('column') || error.message.includes('View')) {
                console.error('=== DATABASE/VIEW ERROR DETECTED ===');
                console.error('Kemungkinan masalah:');
                console.error('1. View entity SQL salah');
                console.error('2. Column tidak ada di database');
                console.error('3. Database view tidak sinkron');
            }
            throw new common_1.BadRequestException(`Failed to fetch repository data: ${error.message}`);
        }
    }
    async getRepositoryDataByModule(module, filters, pagination) {
        const moduleFilters = {
            ...filters,
            moduleTypes: [module],
        };
        return this.getRepositoryData(moduleFilters, pagination);
    }
    async searchRepositoryData(query, filters, pagination) {
        const searchFilters = {
            ...filters,
            searchQuery: query,
        };
        return this.getRepositoryData(searchFilters, pagination);
    }
    async getRepositoryStatistics(year, quarter) {
        try {
            const data = await this.repositoryView.find({
                where: { year, quarter },
            });
            if (data.length === 0) {
                return this.getEmptyStatistics();
            }
            const byModule = this.groupByModule(data);
            const byQuarter = this.groupByQuarter(data);
            const validated = data.filter((item) => item.isValidated).length;
            const notValidated = data.length - validated;
            const byModuleArray = Object.entries(byModule).map(([module, items]) => {
                const moduleItems = items;
                const totalWeighted = moduleItems.reduce((sum, item) => sum + (item.weighted || 0), 0);
                return {
                    module: this.getModuleName(module),
                    count: moduleItems.length,
                    totalWeighted,
                    averageWeighted: totalWeighted / moduleItems.length,
                };
            });
            const byQuarterArray = Object.entries(byQuarter).map(([quarter, items]) => {
                const quarterItems = items;
                return {
                    quarter,
                    count: quarterItems.length,
                    totalWeighted: quarterItems.reduce((sum, item) => sum + (item.weighted || 0), 0),
                };
            });
            return {
                totalModules: Object.keys(byModule).length,
                totalIndicators: data.length,
                totalWeighted: data.reduce((sum, item) => sum + (item.weighted || 0), 0),
                byModule: byModuleArray,
                byQuarter: byQuarterArray,
                validationStatus: {
                    validated,
                    notValidated,
                },
            };
        }
        catch (error) {
            console.error('Error in getRepositoryStatistics:', error);
            throw new common_1.BadRequestException('Failed to fetch repository statistics');
        }
    }
    async exportRepositoryData(filters, format) {
        const pagination = { page: 1, limit: 10000 };
        const response = await this.getRepositoryData(filters, pagination);
        switch (format) {
            case 'csv':
                return this.exportToCsv(response.data);
            case 'excel':
            case 'pdf':
            default:
                throw new common_1.BadRequestException(`Export format ${format} is not yet supported. Please use CSV.`);
        }
    }
    async getAvailablePeriods() {
        try {
            const result = await this.repositoryView
                .createQueryBuilder('view')
                .select('view.year, view.quarter')
                .groupBy('view.year, view.quarter')
                .orderBy('view.year', 'DESC')
                .addOrderBy('view.quarter', 'DESC')
                .getRawMany();
            const groupedByYear = result.reduce((acc, row) => {
                const year = row.view_year;
                const quarter = row.view_quarter;
                if (!acc[year]) {
                    acc[year] = [];
                }
                if (!acc[year].includes(quarter)) {
                    acc[year].push(quarter);
                }
                return acc;
            }, {});
            return Object.entries(groupedByYear).map(([year, quarters]) => ({
                year: parseInt(year),
                quarters: quarters,
            }));
        }
        catch (error) {
            console.error('Error in getAvailablePeriods:', error);
            return [];
        }
    }
    async debugModuleData(module, year = 2026, quarter = 'Q1') {
        try {
            if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
                throw new common_1.BadRequestException('Invalid quarter value');
            }
            const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(DISTINCT section_id) as total_sections,
          GROUP_CONCAT(DISTINCT no ORDER BY no) as sections,
          GROUP_CONCAT(DISTINCT section_label) as section_labels
        FROM indikators_${module.toLowerCase()}
        WHERE year = ${year} AND quarter = '${quarter}'
      `;
            const result = await this.repositoryView.query(query);
            const sampleQuery = `
        SELECT 
          id, section_id, no, section_label, sub_no, indikator
        FROM indikators_${module.toLowerCase()}
        WHERE year = ${year} AND quarter = '${quarter}'
        ORDER BY no, sub_no
        LIMIT 10
      `;
            const sampleData = await this.repositoryView.query(sampleQuery);
            return {
                module,
                year,
                quarter,
                summary: result[0],
                sampleData,
            };
        }
        catch (error) {
            console.error(`Debug error for module ${module}:`, error);
            throw new common_1.BadRequestException(`Failed to debug module ${module}`);
        }
    }
    transformToDto(entity) {
        return {
            id: entity.id,
            moduleType: entity.moduleType,
            moduleName: this.getModuleName(entity.moduleType),
            year: entity.year,
            quarter: entity.quarter,
            no: entity.no,
            bobotSection: entity.bobotSection,
            parameter: entity.parameter,
            sectionDescription: entity.sectionDescription,
            subNo: entity.subNo,
            indikator: entity.indikator,
            bobotIndikator: entity.bobotIndikator,
            sumberRisiko: entity.sumberRisiko,
            dampak: entity.dampak,
            low: entity.low,
            lowToModerate: entity.lowToModerate,
            moderate: entity.moderate,
            moderateToHigh: entity.moderateToHigh,
            high: entity.high,
            mode: entity.mode,
            formula: entity.formula,
            isPercent: entity.isPercent,
            pembilangLabel: entity.pembilangLabel,
            pembilangValue: entity.pembilangValue,
            penyebutLabel: entity.penyebutLabel,
            penyebutValue: entity.penyebutValue,
            hasil: entity.hasil,
            hasilText: entity.hasilText,
            peringkat: entity.peringkat,
            weighted: entity.weighted,
            keterangan: entity.keterangan,
            isValidated: entity.isValidated,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    calculateStatistics(data) {
        if (data.length === 0) {
            return {
                totalModules: 0,
                totalIndicators: 0,
                totalWeighted: 0,
                moduleBreakdown: [],
            };
        }
        const moduleBreakdown = data.reduce((acc, item) => {
            const module = item.moduleType;
            if (!acc[module]) {
                acc[module] = { count: 0, totalWeighted: 0 };
            }
            acc[module].count++;
            acc[module].totalWeighted += item.weighted || 0;
            return acc;
        }, {});
        const totalWeighted = data.reduce((sum, item) => sum + (item.weighted || 0), 0);
        return {
            totalModules: Object.keys(moduleBreakdown).length,
            totalIndicators: data.length,
            totalWeighted,
            moduleBreakdown: Object.entries(moduleBreakdown).map(([module, stats]) => ({
                module: this.getModuleName(module),
                count: stats.count,
                totalWeighted: stats.totalWeighted,
            })),
        };
    }
    groupByModule(data) {
        return data.reduce((acc, item) => {
            const module = item.moduleType;
            if (!acc[module]) {
                acc[module] = [];
            }
            acc[module].push(item);
            return acc;
        }, {});
    }
    groupByQuarter(data) {
        return data.reduce((acc, item) => {
            const quarter = item.quarter;
            if (!acc[quarter]) {
                acc[quarter] = [];
            }
            acc[quarter].push(item);
            return acc;
        }, {});
    }
    getEmptyStatistics() {
        return {
            totalModules: 0,
            totalIndicators: 0,
            totalWeighted: 0,
            byModule: [],
            byQuarter: [],
            validationStatus: {
                validated: 0,
                notValidated: 0,
            },
        };
    }
    getModuleName(module) {
        const moduleNames = {
            [resiko_profile_repository_entity_2.ModuleType.KEPATUHAN]: 'Kepatuhan',
            [resiko_profile_repository_entity_2.ModuleType.REPUTASI]: 'Reputasi',
            [resiko_profile_repository_entity_2.ModuleType.INVESTASI]: 'Investasi',
            [resiko_profile_repository_entity_2.ModuleType.LIKUIDITAS]: 'Likuiditas',
            [resiko_profile_repository_entity_2.ModuleType.OPERASIONAL]: 'Operasional',
            [resiko_profile_repository_entity_2.ModuleType.STRATEGIK]: 'Strategik',
            [resiko_profile_repository_entity_2.ModuleType.HUKUM]: 'Hukum',
            [resiko_profile_repository_entity_2.ModuleType.PASAR]: 'Pasar',
        };
        return moduleNames[module] || module;
    }
    exportToCsv(data) {
        const headers = [
            'Module',
            'Year',
            'Quarter',
            'Section No',
            'Section',
            'Sub No',
            'Indikator',
            'Bobot Indikator',
            'Sumber Risiko',
            'Dampak',
            'Hasil',
            'Peringkat',
            'Weighted',
            'Created At',
        ];
        const rows = data.map((item) => [
            `"${item.moduleName}"`,
            item.year,
            `"${item.quarter}"`,
            `"${item.no}"`,
            `"${item.parameter.replace(/"/g, '""')}"`,
            `"${item.subNo}"`,
            `"${item.indikator.replace(/"/g, '""')}"`,
            item.bobotIndikator,
            `"${(item.sumberRisiko || '').replace(/"/g, '""')}"`,
            `"${(item.dampak || '').replace(/"/g, '""')}"`,
            item.hasil || `"${(item.hasilText || '').replace(/"/g, '""')}"`,
            item.peringkat,
            item.weighted.toFixed(4),
            item.createdAt.toISOString(),
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');
        return Buffer.from(csvContent, 'utf-8');
    }
};
exports.ResikoProfileRepositoryService = ResikoProfileRepositoryService;
exports.ResikoProfileRepositoryService = ResikoProfileRepositoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resiko_profile_repository_entity_1.RiskProfileRepositoryView)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResikoProfileRepositoryService);
//# sourceMappingURL=resiko-profile-repository.service.js.map