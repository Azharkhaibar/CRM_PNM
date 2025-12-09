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
    low = 'x ≤ 1%';
    lowToModerate = '1% < x ≤ 2%';
    moderate = '2% < x ≤ 3%';
    moderateToHigh = '3% < x ≤ 4%';
    high = 'x > 4%';
    mode = new_investasi_entity_1.CalculationMode.RASIO;
    numeratorLabel;
    numeratorValue;
    denominatorLabel;
    denominatorValue;
    formula;
    isPercent = false;
    hasil;
    peringkat;
    weighted;
    keterangan;
}
exports.CreateInvestasiDto = CreateInvestasiDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(new_investasi_entity_1.Quarter),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "sectionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "sectionLabel", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "bobotSection", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "subNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "indikator", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "dampak", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "low", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "moderate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "high", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(new_investasi_entity_1.CalculationMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "numeratorLabel", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "numeratorValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "denominatorLabel", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "denominatorValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "formula", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateInvestasiDto.prototype, "isPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "hasil", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "peringkat", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestasiDto.prototype, "weighted", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvestasiDto.prototype, "keterangan", void 0);
//# sourceMappingURL=create-new-investasi.dto.js.map