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
var KpmrPasarController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrPasarController = void 0;
const common_1 = require("@nestjs/common");
const kpmr_pasar_service_1 = require("./kpmr-pasar.service");
const create_kpmr_pasar_dto_1 = require("./dto/create-kpmr-pasar.dto");
const update_kpmr_pasar_dto_1 = require("./dto/update-kpmr-pasar.dto");
const response_kpmr_pasar_dto_1 = require("./dto/response-kpmr-pasar.dto");
let KpmrPasarController = KpmrPasarController_1 = class KpmrPasarController {
    kpmrPasarService;
    logger = new common_1.Logger(KpmrPasarController_1.name);
    constructor(kpmrPasarService) {
        this.kpmrPasarService = kpmrPasarService;
    }
    async create(createKpmrPasarDto) {
        this.logger.log('Creating KPMR Pasar:', createKpmrPasarDto);
        const data = await this.kpmrPasarService.create(createKpmrPasarDto);
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data, 'Data KPMR Pasar berhasil dibuat');
    }
    async findAllByPeriod(year, quarter) {
        this.logger.log(`Fetching data for period: ${year} ${quarter}`);
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            throw new common_1.BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
        }
        const data = await this.kpmrPasarService.findGroupedByAspek(year, quarter);
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data);
    }
    async findAll() {
        const data = await this.kpmrPasarService.findAllByPeriod(new Date().getFullYear(), 'Q1');
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data);
    }
    async getPeriods() {
        const data = await this.kpmrPasarService.getPeriods();
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data);
    }
    async findOne(id) {
        const data = await this.kpmrPasarService.findOne(id);
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data);
    }
    async getTotalAverage(year, quarter) {
        if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
            throw new common_1.BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
        }
        const average = await this.kpmrPasarService.getTotalAverage(year, quarter);
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success({ average });
    }
    async update(id, updateKpmrPasarDto) {
        this.logger.log(`Updating KPMR Pasar ${id}:`, updateKpmrPasarDto);
        const data = await this.kpmrPasarService.update(id, updateKpmrPasarDto);
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data, 'Data KPMR Pasar berhasil diupdate');
    }
    async remove(id) {
        this.logger.log(`Deleting KPMR Pasar: ${id}`);
        await this.kpmrPasarService.remove(id);
    }
    async searchByCriteria(year, quarter, aspekNo, sectionNo) {
        const data = await this.kpmrPasarService.findByCriteria({
            year: year ? parseInt(year) : undefined,
            quarter,
            aspekNo,
            sectionNo,
        });
        return response_kpmr_pasar_dto_1.KpmrPasarResponseDto.success(data);
    }
};
exports.KpmrPasarController = KpmrPasarController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpmr_pasar_dto_1.CreateKpmrPasarDto]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "findAllByPeriod", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('periods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "getPeriods", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('average/total'),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('quarter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "getTotalAverage", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_kpmr_pasar_dto_1.UpdateKpmrPasarDto]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('search/criteria'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('quarter')),
    __param(2, (0, common_1.Query)('aspekNo')),
    __param(3, (0, common_1.Query)('sectionNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], KpmrPasarController.prototype, "searchByCriteria", null);
exports.KpmrPasarController = KpmrPasarController = KpmrPasarController_1 = __decorate([
    (0, common_1.Controller)('kpmr-pasar'),
    __metadata("design:paramtypes", [kpmr_pasar_service_1.KpmrPasarService])
], KpmrPasarController);
//# sourceMappingURL=kpmr-pasar.controller.js.map