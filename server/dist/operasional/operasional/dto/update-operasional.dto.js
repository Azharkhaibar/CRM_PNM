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
exports.UpdateIndikatorOperationalDto = exports.UpdateSectionOperationalDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const operasional_entity_1 = require("../entities/operasional.entity");
class UpdateSectionOperationalDto {
    no;
    parameter;
    bobotSection;
    year;
    quarter;
}
exports.UpdateSectionOperationalDto = UpdateSectionOperationalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '4.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSectionOperationalDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Parameter Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSectionOperationalDto.prototype, "parameter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 90 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSectionOperationalDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2025 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateSectionOperationalDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: operasional_entity_1.Quarter, example: 'Q2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(operasional_entity_1.Quarter),
    __metadata("design:type", String)
], UpdateSectionOperationalDto.prototype, "quarter", void 0);
class UpdateIndikatorOperationalDto {
    sectionId;
    year;
    quarter;
    subNo;
    indikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    mode;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    formula;
    isPercent;
    hasil;
    peringkat;
    weighted;
    keterangan;
}
exports.UpdateIndikatorOperationalDto = UpdateIndikatorOperationalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: operasional_entity_1.Quarter, example: 'Q1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(operasional_entity_1.Quarter),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '4.1.2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Indikator Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "indikator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sumber risiko updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dampak updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['RASIO', 'NILAI_TUNGGAL'],
        example: 'RASIO',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['RASIO', 'NILAI_TUNGGAL']),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pembilang Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 300 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Penyebut Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'pemb * 100 / peny' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateIndikatorOperationalDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.035 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12.5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateIndikatorOperationalDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Keterangan updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIndikatorOperationalDto.prototype, "keterangan", void 0);
//# sourceMappingURL=update-operasional.dto.js.map