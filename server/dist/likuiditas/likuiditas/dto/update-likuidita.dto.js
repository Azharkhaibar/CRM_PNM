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
exports.UpdateIndikatorLikuiditasDto = exports.UpdateSectionLikuiditasDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const likuiditas_entity_1 = require("../entities/likuiditas.entity");
class UpdateSectionLikuiditasDto {
    no;
    parameter;
    bobotSection;
    description;
    year;
    quarter;
}
exports.UpdateSectionLikuiditasDto = UpdateSectionLikuiditasDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '3.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSectionLikuiditasDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Parameter Likuiditas Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSectionLikuiditasDto.prototype, "parameter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 90 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSectionLikuiditasDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSectionLikuiditasDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2025 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateSectionLikuiditasDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: likuiditas_entity_1.Quarter, example: 'Q2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(likuiditas_entity_1.Quarter),
    __metadata("design:type", String)
], UpdateSectionLikuiditasDto.prototype, "quarter", void 0);
class UpdateIndikatorLikuiditasDto {
    sectionId;
    year;
    quarter;
    subNo;
    namaIndikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
    mode;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    formula;
    isPercent;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
}
exports.UpdateIndikatorLikuiditasDto = UpdateIndikatorLikuiditasDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: likuiditas_entity_1.Quarter, example: 'Q1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(likuiditas_entity_1.Quarter),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '3.1.2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Current Ratio Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "namaIndikator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Risiko updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dampak updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'x ≥ 1.6' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.4 ≤ x < 1.6' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.2 ≤ x < 1.4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "moderate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.05 ≤ x < 1.2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'x < 1.05' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['RASIO', 'NILAI_TUNGGAL', 'TEKS'],
        example: 'RASIO',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['RASIO', 'NILAI_TUNGGAL', 'TEKS']),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aktiva Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hutang Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'pemb * 100 / peny' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateIndikatorLikuiditasDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hasil updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "hasilText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 18.5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorLikuiditasDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Keterangan updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorLikuiditasDto.prototype, "keterangan", void 0);
//# sourceMappingURL=update-likuidita.dto.js.map