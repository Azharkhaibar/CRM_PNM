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
exports.CreateReputasiDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const reputasi_entity_1 = require("../entities/reputasi.entity");
class CreateReputasiDto {
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
    mode = reputasi_entity_1.CalculationMode.RASIO;
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
exports.CreateReputasiDto = CreateReputasiDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q1', enum: reputasi_entity_1.Quarter, description: 'Triwulan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quarter tidak boleh kosong' }),
    (0, class_validator_1.IsEnum)(reputasi_entity_1.Quarter, { message: 'Quarter harus Q1, Q2, Q3, atau Q4' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID section dari master' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Section ID tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Section ID harus berupa angka bulat' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6.1', description: 'Nomor section' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Pencapaian Rencana Bisnis Perusahaan',
        description: 'Label section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Section label tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Section label harus berupa string' }),
    (0, class_validator_1.Length)(1, 500, { message: 'Section label maksimal 500 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "sectionLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Bobot section dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot section tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot section harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot section minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot section maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '6.1.1',
        description: 'Nomor sub indikator (unik per periode+section)',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Sub No tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Sub No harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Sub No maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Pencapaian KPI Kuartal',
        description: 'Nama indikator',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Indikator tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Indikator harus berupa string' }),
    (0, class_validator_1.Length)(1, 1000, { message: 'Indikator maksimal 1000 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "indikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Bobot indikator dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot indikator tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot indikator harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot indikator minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot indikator maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Target KPI yang terlalu ambisius atau tidak realistis',
        required: false,
        description: 'Sumber risiko',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Sumber risiko harus berupa string' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Tujuan tahunan organisasi bisa meleset',
        required: false,
        description: 'Dampak risiko',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Dampak harus berupa string' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'x > 90%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Low harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Low maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '90% ≥ x > 70%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Low to moderate harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Low to moderate maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '70% ≥ x > 50%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Moderate harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Moderate maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "moderate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '50% ≥ x > 30%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Moderate to high harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Moderate to high maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'x < 30%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'High harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'High maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: reputasi_entity_1.CalculationMode.RASIO,
        enum: reputasi_entity_1.CalculationMode,
        default: reputasi_entity_1.CalculationMode.RASIO,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mode tidak boleh kosong' }),
    (0, class_validator_1.IsEnum)(reputasi_entity_1.CalculationMode, {
        message: 'Mode harus RASIO, NILAI_TUNGGAL, atau TEKS',
    }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pemb / peny', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Formula harus berupa string' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is percent harus berupa boolean' }),
    __metadata("design:type", Boolean)
], CreateReputasiDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Actual KPI',
        required: false,
        description: 'Hanya untuk mode RASIO',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === reputasi_entity_1.CalculationMode.RASIO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Pembilang label harus berupa string' }),
    (0, class_validator_1.Length)(0, 255, { message: 'Pembilang label maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 96.55,
        required: false,
        description: 'Hanya untuk mode RASIO',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === reputasi_entity_1.CalculationMode.RASIO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Pembilang value harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Target KPI',
        required: false,
        description: 'Tidak untuk mode TEKS',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== reputasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Penyebut label harus berupa string' }),
    (0, class_validator_1.Length)(0, 255, { message: 'Penyebut label maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        required: false,
        description: 'Tidak untuk mode TEKS',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== reputasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Penyebut value harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.9655, required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== reputasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Hasil harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '96.55%',
        required: false,
        description: 'Hanya untuk mode TEKS',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === reputasi_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Hasil text harus berupa string' }),
    (0, class_validator_1.Length)(0, 1000, { message: 'Hasil text maksimal 1000 karakter' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "hasilText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Peringkat 1-5' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Peringkat tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Peringkat harus berupa angka bulat' }),
    (0, class_validator_1.Min)(1, { message: 'Peringkat minimal 1' }),
    (0, class_validator_1.Max)(5, { message: 'Peringkat maksimal 5' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.5, description: 'Weighted value' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Weighted tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Weighted harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Weighted minimal 0' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReputasiDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Keterangan tambahan', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Keterangan harus berupa string' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "keterangan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Created by harus berupa string' }),
    __metadata("design:type", String)
], CreateReputasiDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-reputasi.dto.js.map