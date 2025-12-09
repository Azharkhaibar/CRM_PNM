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
exports.CreateIndikatorOperationalDto = exports.CreateSectionOperationalDto = exports.CreateOperasionalDto = void 0;
class CreateOperasionalDto {
}
exports.CreateOperasionalDto = CreateOperasionalDto;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const operasional_entity_1 = require("../entities/operasional.entity");
class CreateSectionOperationalDto {
    no;
    bobotSection;
    parameter;
    year;
    quarter;
}
exports.CreateSectionOperationalDto = CreateSectionOperationalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '4.1', description: 'Nomor section' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSectionOperationalDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Bobot section dalam persen' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSectionOperationalDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kualitas Pengelolaan Risiko Operasional',
        description: 'Nama section/parameter',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSectionOperationalDto.prototype, "parameter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSectionOperationalDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: operasional_entity_1.Quarter, example: 'Q1', description: 'Triwulan' }),
    (0, class_validator_1.IsEnum)(operasional_entity_1.Quarter),
    __metadata("design:type", String)
], CreateSectionOperationalDto.prototype, "quarter", void 0);
class CreateIndikatorOperationalDto {
    sectionId;
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
    year;
    quarter;
}
exports.CreateIndikatorOperationalDto = CreateIndikatorOperationalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID section' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateIndikatorOperationalDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '4.1.1', description: 'Sub nomor indikator' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndikatorOperationalDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jumlah kejadian fraud internal',
        description: 'Nama indikator',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndikatorOperationalDto.prototype, "indikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Bobot indikator dalam persen' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndikatorOperationalDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Kelemahan pengendalian internal, kurangnya pemisahan fungsi.',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Kerugian finansial dan reputasi perusahaan.',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['RASIO', 'NILAI_TUNGGAL'],
        example: 'RASIO',
        description: 'Mode perhitungan',
    }),
    (0, class_validator_1.IsEnum)(['RASIO', 'NILAI_TUNGGAL']),
    __metadata("design:type", String)
], CreateIndikatorOperationalDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Kerugian operasional (juta rupiah)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 250, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Pendapatan operasional (juta rupiah)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10000, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'pemb / peny', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIndikatorOperationalDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.025, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateIndikatorOperationalDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndikatorOperationalDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Data per triwulan',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorOperationalDto.prototype, "keterangan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateIndikatorOperationalDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: operasional_entity_1.Quarter, example: 'Q1' }),
    (0, class_validator_1.IsEnum)(operasional_entity_1.Quarter),
    __metadata("design:type", String)
], CreateIndikatorOperationalDto.prototype, "quarter", void 0);
//# sourceMappingURL=create-operasional.dto.js.map