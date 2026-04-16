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
exports.CreateInvestasiDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const new_investasi_entity_1 = require("../entities/new-investasi.entity");
class CreateInvestasiDto {
    year;
    quarter;
    sectionId;
    no;
    sectionLabel;
    bobotSection;
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
    mode = new_investasi_entity_1.CalculationMode.RASIO;
    formula;
    isPercent = false;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
    createdBy;
}
exports.CreateInvestasiDto = CreateInvestasiDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q1', enum: new_investasi_entity_1.Quarter }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(new_investasi_entity_1.Quarter),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6.1' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pencapaian Rencana Bisnis Perusahaan' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "sectionLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6.1.1' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pencapaian KPI Kuartal' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 1000),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "indikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "moderate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: new_investasi_entity_1.CalculationMode, default: new_investasi_entity_1.CalculationMode.RASIO }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(new_investasi_entity_1.CalculationMode),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInvestasiDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === new_investasi_entity_1.CalculationMode.RASIO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 255),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === new_investasi_entity_1.CalculationMode.RASIO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== new_investasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 255),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== new_investasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== new_investasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === new_investasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 1000),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "hasilText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.5 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "keterangan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-new-investasi.dto.js.map