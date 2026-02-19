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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskProfileRepositoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const resiko_profile_repository_entity_1 = require("../entities/resiko-profile-repository.entity");
class RiskProfileRepositoryDto {
    id;
    moduleType;
    moduleName;
    year;
    quarter;
    no;
    bobotSection;
    parameter;
    sectionDescription;
    subNo;
    indikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
    mode;
    formula;
    isPercent;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
    isValidated;
    createdAt;
    updatedAt;
}
exports.RiskProfileRepositoryDto = RiskProfileRepositoryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: resiko_profile_repository_entity_1.ModuleType }),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "moduleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "moduleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: resiko_profile_repository_entity_1.Quarter }),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "parameter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "sectionDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "indikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "moderate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: resiko_profile_repository_entity_1.CalculationMode }),
    __metadata("design:type", String)
], RiskProfileRepositoryDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], RiskProfileRepositoryDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "hasilText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RiskProfileRepositoryDto.prototype, "keterangan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], RiskProfileRepositoryDto.prototype, "isValidated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RiskProfileRepositoryDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RiskProfileRepositoryDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=risk-profile-repository.dto.js.map