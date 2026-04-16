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
exports.KPMRPasarController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kpmr_pasar_service_1 = require("./kpmr-pasar.service");
const kpmr_pasar_dto_1 = require("./dto/kpmr-pasar.dto");
let KPMRPasarController = class KPMRPasarController {
    kpmrPasarService;
    constructor(kpmrPasarService) {
        this.kpmrPasarService = kpmrPasarService;
    }
    async createAspect(createDto) {
        return await this.kpmrPasarService.createAspect(createDto);
    }
    async getAllAspects(year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrPasarService.findAllAspects(yearNum);
    }
    async getAspect(id) {
        return await this.kpmrPasarService.findAspectById(id);
    }
    async updateAspect(id, updateDto) {
        return await this.kpmrPasarService.updateAspect(id, updateDto);
    }
    async deleteAspect(id) {
        return await this.kpmrPasarService.deleteAspect(id);
    }
    async createQuestion(createDto) {
        return await this.kpmrPasarService.createQuestion(createDto);
    }
    async getAllQuestions(year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrPasarService.findAllQuestions(yearNum);
    }
    async getQuestionsByAspect(aspekNo, year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrPasarService.findQuestionsByAspect(aspekNo, yearNum);
    }
    async getQuestion(id) {
        return await this.kpmrPasarService.findQuestionById(id);
    }
    async updateQuestion(id, updateDto) {
        return await this.kpmrPasarService.updateQuestion(id, updateDto);
    }
    async deleteQuestion(id) {
        return await this.kpmrPasarService.deleteQuestion(id);
    }
    async createOrUpdateDefinition(createDto) {
        return await this.kpmrPasarService.createOrUpdateDefinition(createDto);
    }
    async getAllDefinitions() {
        return await this.kpmrPasarService.findAllDefinitions();
    }
    async getDefinitionsByYear(year) {
        return await this.kpmrPasarService.findDefinitionsByYear(parseInt(year, 10));
    }
    async getDefinition(id) {
        return await this.kpmrPasarService.findDefinitionById(id);
    }
    async updateDefinition(id, updateDto) {
        return await this.kpmrPasarService.updateDefinition(id, updateDto);
    }
    async deleteDefinitionPermanent(definitionId, year) {
        console.log('🗑️ DELETE DEFINITION REQUEST:', { definitionId, year });
        const result = await this.kpmrPasarService.deleteDefinition(definitionId, year);
        return result;
    }
    async createOrUpdateScore(createDto) {
        return await this.kpmrPasarService.createOrUpdateScore(createDto);
    }
    async getAllScores() {
        return await this.kpmrPasarService.findAllScores();
    }
    async getScoresByPeriod(year, quarter) {
        return await this.kpmrPasarService.findScoresByPeriod(parseInt(year, 10), quarter);
    }
    async getScoresByDefinition(definitionId) {
        return await this.kpmrPasarService.findScoresByDefinition(definitionId);
    }
    async getScore(id) {
        return await this.kpmrPasarService.findScoreById(id);
    }
    async updateScore(id, updateDto) {
        return await this.kpmrPasarService.updateScore(id, updateDto);
    }
    async deleteScore(id) {
        return await this.kpmrPasarService.deleteScore(id);
    }
    async deleteScoreByTarget(body) {
        return await this.kpmrPasarService.deleteScoreByTarget(body.definitionId, body.year, body.quarter);
    }
    async getFullData(year) {
        return await this.kpmrPasarService.getKPMRFullData(parseInt(year, 10));
    }
    async searchKPMR(year, query, aspekNo) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrPasarService.searchKPMR(yearNum, query, aspekNo);
    }
    async getAvailableYears() {
        const years = await this.kpmrPasarService.getAvailableYears();
        return { success: true, data: years };
    }
    async getPeriods() {
        const periods = await this.kpmrPasarService.getPeriods();
        return { success: true, data: periods };
    }
};
exports.KPMRPasarController = KPMRPasarController;
__decorate([
    (0, common_1.Post)('aspects'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new KPMR Pasar aspect' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_pasar_dto_1.CreateKPMRPasarAspectDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "createAspect", null);
__decorate([
    (0, common_1.Get)('aspects'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Pasar aspects' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getAllAspects", null);
__decorate([
    (0, common_1.Get)('aspects/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPMR Pasar aspect by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getAspect", null);
__decorate([
    (0, common_1.Put)('aspects/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR Pasar aspect' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_pasar_dto_1.UpdateKPMRPasarAspectDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "updateAspect", null);
__decorate([
    (0, common_1.Delete)('aspects/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete KPMR Pasar aspect' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "deleteAspect", null);
__decorate([
    (0, common_1.Post)('questions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new KPMR Pasar question' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_pasar_dto_1.CreateKPMRPasarQuestionDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Get)('questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Pasar questions' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getAllQuestions", null);
__decorate([
    (0, common_1.Get)('questions/aspect/:aspekNo'),
    (0, swagger_1.ApiOperation)({ summary: 'Get questions by aspect' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Param)('aspekNo')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getQuestionsByAspect", null);
__decorate([
    (0, common_1.Get)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getQuestion", null);
__decorate([
    (0, common_1.Put)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR Pasar question' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_pasar_dto_1.UpdateKPMRPasarQuestionDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete KPMR Pasar question' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)('definitions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KPMR Pasar definition' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_pasar_dto_1.CreateKPMRPasarDefinitionDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "createOrUpdateDefinition", null);
__decorate([
    (0, common_1.Get)('definitions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Pasar definitions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getAllDefinitions", null);
__decorate([
    (0, common_1.Get)('definitions/year/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get definitions by year' }),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getDefinitionsByYear", null);
__decorate([
    (0, common_1.Get)('definitions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get definition by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getDefinition", null);
__decorate([
    (0, common_1.Put)('definitions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update definition' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_pasar_dto_1.UpdateKPMRPasarDefinitionDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "updateDefinition", null);
__decorate([
    (0, common_1.Delete)('definition/:definitionId/:year'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete definition with scores' }),
    __param(0, (0, common_1.Param)('definitionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "deleteDefinitionPermanent", null);
__decorate([
    (0, common_1.Post)('scores'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KPMR Pasar score' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_pasar_dto_1.CreateKPMRPasarScoreDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "createOrUpdateScore", null);
__decorate([
    (0, common_1.Get)('scores'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all scores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getAllScores", null);
__decorate([
    (0, common_1.Get)('scores/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scores by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getScoresByPeriod", null);
__decorate([
    (0, common_1.Get)('scores/definition/:definitionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scores by definition' }),
    __param(0, (0, common_1.Param)('definitionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getScoresByDefinition", null);
__decorate([
    (0, common_1.Get)('scores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get score by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getScore", null);
__decorate([
    (0, common_1.Put)('scores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update score' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_pasar_dto_1.UpdateKPMRPasarScoreDto]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Delete)('scores/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete score' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "deleteScore", null);
__decorate([
    (0, common_1.Post)('scores/target/delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete score by target' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "deleteScoreByTarget", null);
__decorate([
    (0, common_1.Get)('full-data/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete KPMR Pasar data with grouping' }),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getFullData", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search KPMR Pasar data' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'aspekNo', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('aspekNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "searchKPMR", null);
__decorate([
    (0, common_1.Get)('years'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available years' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getAvailableYears", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available periods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRPasarController.prototype, "getPeriods", null);
exports.KPMRPasarController = KPMRPasarController = __decorate([
    (0, swagger_1.ApiTags)('KPMR Pasar'),
    (0, common_1.Controller)('kpmr-pasar'),
    __metadata("design:paramtypes", [kpmr_pasar_service_1.KPMRPasarService])
], KPMRPasarController);
//# sourceMappingURL=kpmr-pasar.controller.js.map