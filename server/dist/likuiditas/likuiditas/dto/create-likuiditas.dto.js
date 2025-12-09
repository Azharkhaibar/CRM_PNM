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
exports.CreateIndikatorLikuiditasDto = exports.CreateSectionLikuiditasDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const likuiditas_entity_1 = require("../entities/likuiditas.entity");
class CreateSectionLikuiditasDto {
    no;
    bobotSection;
    parameter;
    description;
    year;
    quarter;
}
exports.CreateSectionLikuiditasDto = CreateSectionLikuiditasDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3.1', description: 'Nomor section' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSectionLikuiditasDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Bobot section dalam persen' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSectionLikuiditasDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Parameter Likuiditas', description: 'Nama section' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSectionLikuiditasDto.prototype, "parameter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi section', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateSectionLikuiditasDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSectionLikuiditasDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: likuiditas_entity_1.Quarter, example: 'Q1', description: 'Triwulan' }),
    (0, class_validator_1.IsEnum)(likuiditas_entity_1.Quarter),
    __metadata("design:type", String)
], CreateSectionLikuiditasDto.prototype, "quarter", void 0);
class CreateIndikatorLikuiditasDto {
    sectionId;
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
    year;
    quarter;
}
exports.CreateIndikatorLikuiditasDto = CreateIndikatorLikuiditasDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID section' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateIndikatorLikuiditasDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3.1.1', description: 'Sub nomor indikator' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndikatorLikuiditasDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Current Ratio', description: 'Nama indikator' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndikatorLikuiditasDto.prototype, "namaIndikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Bobot indikator dalam persen' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndikatorLikuiditasDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Penurunan kualitas piutang',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Gagal bayar kewajiban', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'x ≥ 1.5', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.3 ≤ x < 1.5', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.1 ≤ x < 1.3', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "moderate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.0 ≤ x < 1.1', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'x < 1.0', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['RASIO', 'NILAI_TUNGGAL', 'TEKS'], example: 'RASIO' }),
    (0, class_validator_1.IsEnum)(['RASIO', 'NILAI_TUNGGAL', 'TEKS']),
    __metadata("design:type", String)
], CreateIndikatorLikuiditasDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aktiva Lancar (Jutaan)', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hutang Lancar (Jutaan)', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4000, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'pemb / peny', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIndikatorLikuiditasDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.25', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hasil perhitungan', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "hasilText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateIndikatorLikuiditasDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15.75 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndikatorLikuiditasDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Keterangan tambahan', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateIndikatorLikuiditasDto.prototype, "keterangan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateIndikatorLikuiditasDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: likuiditas_entity_1.Quarter, example: 'Q1' }),
    (0, class_validator_1.IsEnum)(likuiditas_entity_1.Quarter),
    __metadata("design:type", String)
], CreateIndikatorLikuiditasDto.prototype, "quarter", void 0);
//# sourceMappingURL=create-likuiditas.dto.js.map