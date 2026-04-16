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
exports.KPMRLikuiditasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kpmr_likuiditas_service_1 = require("./kpmr-likuiditas.service");
const kpmr_likuiditas_dto_1 = require("./dto/kpmr-likuiditas.dto");
let KPMRLikuiditasController = class KPMRLikuiditasController {
    kpmrLikuiditasService;
    constructor(kpmrLikuiditasService) {
        this.kpmrLikuiditasService = kpmrLikuiditasService;
    }
    async createAspect(createDto) {
        return await this.kpmrLikuiditasService.createAspect(createDto);
    }
    async getAllAspects(year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrLikuiditasService.findAllAspects(yearNum);
    }
    async getAspect(id) {
        return await this.kpmrLikuiditasService.findAspectById(id);
    }
    async updateAspect(id, updateDto) {
        return await this.kpmrLikuiditasService.updateAspect(id, updateDto);
    }
    async deleteAspect(id) {
        return await this.kpmrLikuiditasService.deleteAspect(id);
    }
    async createQuestion(createDto) {
        return await this.kpmrLikuiditasService.createQuestion(createDto);
    }
    async getAllQuestions(year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrLikuiditasService.findAllQuestions(yearNum);
    }
    async getQuestionsByAspect(aspekNo, year) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrLikuiditasService.findQuestionsByAspect(aspekNo, yearNum);
    }
    async getQuestion(id) {
        return await this.kpmrLikuiditasService.findQuestionById(id);
    }
    async updateQuestion(id, updateDto) {
        return await this.kpmrLikuiditasService.updateQuestion(id, updateDto);
    }
    async deleteQuestion(id) {
        return await this.kpmrLikuiditasService.deleteQuestion(id);
    }
    async createOrUpdateDefinition(createDto) {
        return await this.kpmrLikuiditasService.createOrUpdateDefinition(createDto);
    }
    async getAllDefinitions() {
        return await this.kpmrLikuiditasService.findAllDefinitions();
    }
    async getDefinitionsByYear(year) {
        return await this.kpmrLikuiditasService.findDefinitionsByYear(year);
    }
    async getDefinition(id) {
        return await this.kpmrLikuiditasService.findDefinitionById(id);
    }
    async updateDefinition(id, updateDto) {
        return await this.kpmrLikuiditasService.updateDefinition(id, updateDto);
    }
    async deleteDefinitionPermanent(definitionId, year) {
        console.log('🗑️ DELETE DEFINITION REQUEST:', { definitionId, year });
        const result = await this.kpmrLikuiditasService.deleteDefinition(definitionId, year);
        return result;
    }
    async createOrUpdateScore(createDto) {
        return await this.kpmrLikuiditasService.createOrUpdateScore(createDto);
    }
    async getAllScores() {
        return await this.kpmrLikuiditasService.findAllScores();
    }
    async getScoresByPeriod(year, quarter) {
        const yearNum = parseInt(year, 10);
        if (isNaN(yearNum)) {
            throw new common_1.BadRequestException('Year harus berupa angka yang valid');
        }
        return await this.kpmrLikuiditasService.findScoresByPeriod(yearNum, quarter);
    }
    async getScoresByDefinition(definitionId) {
        return await this.kpmrLikuiditasService.findScoresByDefinition(definitionId);
    }
    async getScore(id) {
        return await this.kpmrLikuiditasService.findScoreById(id);
    }
    async updateScore(id, updateDto) {
        return await this.kpmrLikuiditasService.updateScore(id, updateDto);
    }
    async deleteScore(id) {
        return await this.kpmrLikuiditasService.deleteScore(id);
    }
    async deleteScoreByTarget(body) {
        return await this.kpmrLikuiditasService.deleteScoreByTarget(body.definitionId, body.year, body.quarter);
    }
    async getFullData(year) {
        return await this.kpmrLikuiditasService.getKPMRFullData(year);
    }
    async searchKPMR(year, query, aspekNo) {
        const yearNum = year ? parseInt(year, 10) : undefined;
        return await this.kpmrLikuiditasService.searchKPMR(yearNum, query, aspekNo);
    }
    async getAvailableYears() {
        const years = await this.kpmrLikuiditasService.getAvailableYears();
        return { success: true, data: years };
    }
    async getPeriods() {
        const periods = await this.kpmrLikuiditasService.getPeriods();
        return { success: true, data: periods };
    }
};
exports.KPMRLikuiditasController = KPMRLikuiditasController;
__decorate([
    (0, common_1.Post)('aspects'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new KPMR Likuiditas aspect' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_likuiditas_dto_1.CreateKPMRLikuiditasAspectDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "createAspect", null);
__decorate([
    (0, common_1.Get)('aspects'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Likuiditas aspects' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getAllAspects", null);
__decorate([
    (0, common_1.Get)('aspects/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPMR Likuiditas aspect by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getAspect", null);
__decorate([
    (0, common_1.Put)('aspects/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR Likuiditas aspect' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_likuiditas_dto_1.UpdateKPMRLikuiditasAspectDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "updateAspect", null);
__decorate([
    (0, common_1.Delete)('aspects/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete KPMR Likuiditas aspect' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "deleteAspect", null);
__decorate([
    (0, common_1.Post)('questions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new KPMR Likuiditas question' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_likuiditas_dto_1.CreateKPMRLikuiditasQuestionDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Get)('questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Likuiditas questions' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getAllQuestions", null);
__decorate([
    (0, common_1.Get)('questions/aspect/:aspekNo'),
    (0, swagger_1.ApiOperation)({ summary: 'Get questions by aspect' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Param)('aspekNo')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getQuestionsByAspect", null);
__decorate([
    (0, common_1.Get)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getQuestion", null);
__decorate([
    (0, common_1.Put)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR Likuiditas question' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_likuiditas_dto_1.UpdateKPMRLikuiditasQuestionDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete KPMR Likuiditas question' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)('definitions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KPMR Likuiditas definition' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_likuiditas_dto_1.CreateKPMRLikuiditasDefinitionDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "createOrUpdateDefinition", null);
__decorate([
    (0, common_1.Get)('definitions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Likuiditas definitions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getAllDefinitions", null);
__decorate([
    (0, common_1.Get)('definitions/year/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get definitions by year' }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getDefinitionsByYear", null);
__decorate([
    (0, common_1.Get)('definitions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get definition by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getDefinition", null);
__decorate([
    (0, common_1.Put)('definitions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update definition' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_likuiditas_dto_1.UpdateKPMRLikuiditasDefinitionDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "updateDefinition", null);
__decorate([
    (0, common_1.Delete)('definition/:definitionId/:year'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete definition with scores' }),
    __param(0, (0, common_1.Param)('definitionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "deleteDefinitionPermanent", null);
__decorate([
    (0, common_1.Post)('scores'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KPMR Likuiditas score' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_likuiditas_dto_1.CreateKPMRLikuiditasScoreDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "createOrUpdateScore", null);
__decorate([
    (0, common_1.Get)('scores'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all scores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getAllScores", null);
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
], KPMRLikuiditasController.prototype, "getScoresByPeriod", null);
__decorate([
    (0, common_1.Get)('scores/definition/:definitionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scores by definition' }),
    __param(0, (0, common_1.Param)('definitionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getScoresByDefinition", null);
__decorate([
    (0, common_1.Get)('scores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get score by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getScore", null);
__decorate([
    (0, common_1.Put)('scores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update score' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_likuiditas_dto_1.UpdateKPMRLikuiditasScoreDto]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Delete)('scores/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete score' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "deleteScore", null);
__decorate([
    (0, common_1.Post)('scores/target/delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete score by target' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "deleteScoreByTarget", null);
__decorate([
    (0, common_1.Get)('full-data/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete KPMR Likuiditas data with grouping' }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getFullData", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search KPMR Likuiditas data' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'aspekNo', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('aspekNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "searchKPMR", null);
__decorate([
    (0, common_1.Get)('years'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available years' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getAvailableYears", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available periods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMRLikuiditasController.prototype, "getPeriods", null);
exports.KPMRLikuiditasController = KPMRLikuiditasController = __decorate([
    (0, swagger_1.ApiTags)('KPMR Likuiditas'),
    (0, common_1.Controller)('kpmr-likuiditas'),
    __metadata("design:paramtypes", [kpmr_likuiditas_service_1.KPMRLikuiditasService])
], KPMRLikuiditasController);
//# sourceMappingURL=kpmr-likuiditas.controller.js.map