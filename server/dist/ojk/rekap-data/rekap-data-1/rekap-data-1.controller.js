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
exports.RekapData1Controller = void 0;
const common_1 = require("@nestjs/common");
const rekap_data_1_service_1 = require("./rekap-data-1.service");
const create_rekap_data_1_dto_1 = require("./dto/create-rekap-data-1.dto");
const update_rekap_data_1_dto_1 = require("./dto/update-rekap-data-1.dto");
let RekapData1Controller = class RekapData1Controller {
    rekapData1Service;
    constructor(rekapData1Service) {
        this.rekapData1Service = rekapData1Service;
    }
    create(createRekapData1Dto) {
        return this.rekapData1Service.create(createRekapData1Dto);
    }
    findAll() {
        return this.rekapData1Service.findAll();
    }
    findOne(id) {
        return this.rekapData1Service.findOne(+id);
    }
    update(id, updateRekapData1Dto) {
        return this.rekapData1Service.update(+id, updateRekapData1Dto);
    }
    remove(id) {
        return this.rekapData1Service.remove(+id);
    }
};
exports.RekapData1Controller = RekapData1Controller;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rekap_data_1_dto_1.CreateRekapData1Dto]),
    __metadata("design:returntype", void 0)
], RekapData1Controller.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RekapData1Controller.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RekapData1Controller.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rekap_data_1_dto_1.UpdateRekapData1Dto]),
    __metadata("design:returntype", void 0)
], RekapData1Controller.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RekapData1Controller.prototype, "remove", null);
exports.RekapData1Controller = RekapData1Controller = __decorate([
    (0, common_1.Controller)('rekap-data-1'),
    __metadata("design:paramtypes", [rekap_data_1_service_1.RekapData1Service])
], RekapData1Controller);
//# sourceMappingURL=rekap-data-1.controller.js.map