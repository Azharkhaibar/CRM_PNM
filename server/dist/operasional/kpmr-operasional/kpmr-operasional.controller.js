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
exports.KPMROperasionalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kpmr_operasional_service_1 = require("./kpmr-operasional.service");
const kpmr_operasional_dto_1 = require("./dto/kpmr-operasional.dto");
let KPMROperasionalController = class KPMROperasionalController {
    kpmrOperasionalService;
    constructor(kpmrOperasionalService) {
        this.kpmrOperasionalService = kpmrOperasionalService;
    }
    async createAspect(createDto) {
        return await this.kpmrOperasionalService.createAspect(createDto);
    }
    async getAllAspects(year) {
        return await this.kpmrOperasionalService.findAllAspects(year);
    }
    async getAspect(id) {
        return await this.kpmrOperasionalService.findAspectById(id);
    }
    async updateAspect(id, updateDto) {
        return await this.kpmrOperasionalService.updateAspect(id, updateDto);
    }
    async deleteAspect(id) {
        return await this.kpmrOperasionalService.deleteAspect(id);
    }
    async createQuestion(createDto) {
        return await this.kpmrOperasionalService.createQuestion(createDto);
    }
    async getAllQuestions(year) {
        return await this.kpmrOperasionalService.findAllQuestions(year);
    }
    async getQuestionsByAspect(aspekNo, year) {
        return await this.kpmrOperasionalService.findQuestionsByAspect(aspekNo, year);
    }
    async getQuestion(id) {
        return await this.kpmrOperasionalService.findQuestionById(id);
    }
    async updateQuestion(id, updateDto) {
        return await this.kpmrOperasionalService.updateQuestion(id, updateDto);
    }
    async deleteQuestion(id) {
        return await this.kpmrOperasionalService.deleteQuestion(id);
    }
    async createOrUpdateDefinition(createDto) {
        return await this.kpmrOperasionalService.createOrUpdateDefinition(createDto);
    }
    async getAllDefinitions() {
        return await this.kpmrOperasionalService.findAllDefinitions();
    }
    async getDefinitionsByYear(year) {
        return await this.kpmrOperasionalService.findDefinitionsByYear(year);
    }
    async getDefinition(id) {
        return await this.kpmrOperasionalService.findDefinitionById(id);
    }
    async updateDefinition(id, updateDto) {
        return await this.kpmrOperasionalService.updateDefinition(id, updateDto);
    }
    async deleteDefinitionPermanent(definitionId, year) {
        console.log('🗑️ DELETE DEFINITION REQUEST:', { definitionId, year });
        const result = await this.kpmrOperasionalService.deleteDefinition(definitionId, year);
        return result;
    }
    async createOrUpdateScore(createDto) {
        return await this.kpmrOperasionalService.createOrUpdateScore(createDto);
    }
    async getAllScores() {
        return await this.kpmrOperasionalService.findAllScores();
    }
    async getScoresByPeriod(year, quarter) {
        return await this.kpmrOperasionalService.findScoresByPeriod(year, quarter);
    }
    async getScoresByDefinition(definitionId) {
        return await this.kpmrOperasionalService.findScoresByDefinition(definitionId);
    }
    async getScore(id) {
        return await this.kpmrOperasionalService.findScoreById(id);
    }
    async updateScore(id, updateDto) {
        return await this.kpmrOperasionalService.updateScore(id, updateDto);
    }
    async deleteScore(id) {
        return await this.kpmrOperasionalService.deleteScore(id);
    }
    async deleteScoreByTarget(body) {
        return await this.kpmrOperasionalService.deleteScoreByTarget(body.definitionId, body.year, body.quarter);
    }
    async getFullData(year) {
        return await this.kpmrOperasionalService.getKPMRFullData(year);
    }
    async searchKPMR(year, query, aspekNo) {
        return await this.kpmrOperasionalService.searchKPMR(year, query, aspekNo);
    }
    async getAvailableYears() {
        const years = await this.kpmrOperasionalService.getAvailableYears();
        return { success: true, data: years };
    }
    async getPeriods() {
        const periods = await this.kpmrOperasionalService.getPeriods();
        return { success: true, data: periods };
    }
};
exports.KPMROperasionalController = KPMROperasionalController;
__decorate([
    (0, common_1.Post)('aspects'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new KPMR Operasional aspect' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_operasional_dto_1.CreateKPMROperasionalAspectDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "createAspect", null);
__decorate([
    (0, common_1.Get)('aspects'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Operasional aspects' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getAllAspects", null);
__decorate([
    (0, common_1.Get)('aspects/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPMR Operasional aspect by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getAspect", null);
__decorate([
    (0, common_1.Put)('aspects/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR Operasional aspect' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_operasional_dto_1.UpdateKPMROperasionalAspectDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "updateAspect", null);
__decorate([
    (0, common_1.Delete)('aspects/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete KPMR Operasional aspect' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "deleteAspect", null);
__decorate([
    (0, common_1.Post)('questions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new KPMR Operasional question' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_operasional_dto_1.CreateKPMROperasionalQuestionDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Get)('questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Operasional questions' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getAllQuestions", null);
__decorate([
    (0, common_1.Get)('questions/aspect/:aspekNo'),
    (0, swagger_1.ApiOperation)({ summary: 'Get questions by aspect' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Param)('aspekNo')),
    __param(1, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getQuestionsByAspect", null);
__decorate([
    (0, common_1.Get)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getQuestion", null);
__decorate([
    (0, common_1.Put)('questions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPMR Operasional question' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_operasional_dto_1.UpdateKPMROperasionalQuestionDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete KPMR Operasional question' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)('definitions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KPMR Operasional definition' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_operasional_dto_1.CreateKPMROperasionalDefinitionDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "createOrUpdateDefinition", null);
__decorate([
    (0, common_1.Get)('definitions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPMR Operasional definitions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getAllDefinitions", null);
__decorate([
    (0, common_1.Get)('definitions/year/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get definitions by year' }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getDefinitionsByYear", null);
__decorate([
    (0, common_1.Get)('definitions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get definition by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getDefinition", null);
__decorate([
    (0, common_1.Put)('definitions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update definition' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_operasional_dto_1.UpdateKPMROperasionalDefinitionDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "updateDefinition", null);
__decorate([
    (0, common_1.Delete)('definition/:definitionId/:year'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete definition with scores' }),
    __param(0, (0, common_1.Param)('definitionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "deleteDefinitionPermanent", null);
__decorate([
    (0, common_1.Post)('scores'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update KPMR Operasional score' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kpmr_operasional_dto_1.CreateKPMROperasionalScoreDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "createOrUpdateScore", null);
__decorate([
    (0, common_1.Get)('scores'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all scores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getAllScores", null);
__decorate([
    (0, common_1.Get)('scores/period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scores by period' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'quarter', required: false }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getScoresByPeriod", null);
__decorate([
    (0, common_1.Get)('scores/definition/:definitionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scores by definition' }),
    __param(0, (0, common_1.Param)('definitionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getScoresByDefinition", null);
__decorate([
    (0, common_1.Get)('scores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get score by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getScore", null);
__decorate([
    (0, common_1.Put)('scores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update score' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, kpmr_operasional_dto_1.UpdateKPMROperasionalScoreDto]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Delete)('scores/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete score' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "deleteScore", null);
__decorate([
    (0, common_1.Post)('scores/target/delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete score by target' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "deleteScoreByTarget", null);
__decorate([
    (0, common_1.Get)('full-data/:year'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete KPMR Operasional data with grouping' }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getFullData", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search KPMR Operasional data' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'aspekNo', required: false }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('aspekNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "searchKPMR", null);
__decorate([
    (0, common_1.Get)('years'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available years' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getAvailableYears", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available periods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KPMROperasionalController.prototype, "getPeriods", null);
exports.KPMROperasionalController = KPMROperasionalController = __decorate([
    (0, swagger_1.ApiTags)('KPMR Operasional'),
    (0, common_1.Controller)('kpmr-operasional'),
    __metadata("design:paramtypes", [kpmr_operasional_service_1.KPMROperasionalService])
], KPMROperasionalController);
//# sourceMappingURL=kpmr-operasional.controller.js.map