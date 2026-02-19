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
exports.CreateOperasionalDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const operasional_section_entity_1 = require("../entities/operasional-section.entity");
const operasional_entity_1 = require("../entities/operasional.entity");
class CreateOperasionalDto {
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
    mode = operasional_entity_1.CalculationMode.RASIO;
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
exports.CreateOperasionalDto = CreateOperasionalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q1', enum: operasional_section_entity_1.Quarter, description: 'Triwulan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quarter tidak boleh kosong' }),
    (0, class_validator_1.IsEnum)(operasional_section_entity_1.Quarter, { message: 'Quarter harus Q1, Q2, Q3, atau Q4' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID section dari master' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Section ID tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Section ID harus berupa angka bulat' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "sectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '7.1', description: 'Nomor section' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Manajemen Sumber Daya Manusia',
        description: 'Label section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Section label tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Section label harus berupa string' }),
    (0, class_validator_1.Length)(1, 500, { message: 'Section label maksimal 500 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "sectionLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Bobot section dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot section tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot section harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot section minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot section maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '7.1.1',
        description: 'Nomor sub indikator (unik per periode+section)',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Sub No tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Sub No harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Sub No maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "subNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Tingkat Kehadiran Karyawan',
        description: 'Nama indikator',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Indikator tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Indikator harus berupa string' }),
    (0, class_validator_1.Length)(1, 1000, { message: 'Indikator maksimal 1000 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "indikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Bobot indikator dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot indikator tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot indikator harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot indikator minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot indikator maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "bobotIndikator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Tingkat absensi yang tinggi',
        required: false,
        description: 'Sumber risiko',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Sumber risiko harus berupa string' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "sumberRisiko", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Produktivitas menurun',
        required: false,
        description: 'Dampak risiko',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Dampak harus berupa string' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "dampak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'x > 95%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Low harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Low maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '95% ≥ x > 85%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Low to moderate harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Low to moderate maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '85% ≥ x > 75%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Moderate harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Moderate maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "moderate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '75% ≥ x > 65%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Moderate to high harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'Moderate to high maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'x < 65%', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'High harus berupa string' }),
    (0, class_validator_1.Length)(0, 200, { message: 'High maksimal 200 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: operasional_entity_1.CalculationMode.RASIO,
        enum: operasional_entity_1.CalculationMode,
        default: operasional_entity_1.CalculationMode.RASIO,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mode tidak boleh kosong' }),
    (0, class_validator_1.IsEnum)(operasional_entity_1.CalculationMode, {
        message: 'Mode harus RASIO, NILAI_TUNGGAL, atau TEKS',
    }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pemb / peny', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Formula harus berupa string' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "formula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is percent harus berupa boolean' }),
    __metadata("design:type", Boolean)
], CreateOperasionalDto.prototype, "isPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jumlah hari hadir',
        required: false,
        description: 'Hanya untuk mode RASIO',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === operasional_entity_1.CalculationMode.RASIO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Pembilang label harus berupa string' }),
    (0, class_validator_1.Length)(0, 255, { message: 'Pembilang label maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "pembilangLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 22,
        required: false,
        description: 'Hanya untuk mode RASIO',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === operasional_entity_1.CalculationMode.RASIO),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Pembilang value harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "pembilangValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jumlah hari kerja',
        required: false,
        description: 'Tidak untuk mode TEKS',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== operasional_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Penyebut label harus berupa string' }),
    (0, class_validator_1.Length)(0, 255, { message: 'Penyebut label maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "penyebutLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 26,
        required: false,
        description: 'Tidak untuk mode TEKS',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== operasional_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Penyebut value harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "penyebutValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.8462, required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.mode !== operasional_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Hasil harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "hasil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '84.62%',
        required: false,
        description: 'Hanya untuk mode TEKS',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === operasional_entity_1.CalculationMode.TEKS),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Hasil text harus berupa string' }),
    (0, class_validator_1.Length)(0, 1000, { message: 'Hasil text maksimal 1000 karakter' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "hasilText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Peringkat 1-5' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Peringkat tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Peringkat harus berupa angka bulat' }),
    (0, class_validator_1.Min)(1, { message: 'Peringkat minimal 1' }),
    (0, class_validator_1.Max)(5, { message: 'Peringkat maksimal 5' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "peringkat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.375, description: 'Weighted value' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Weighted tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Weighted harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Weighted minimal 0' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOperasionalDto.prototype, "weighted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Keterangan tambahan', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Keterangan harus berupa string' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "keterangan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Created by harus berupa string' }),
    __metadata("design:type", String)
], CreateOperasionalDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-operasional.dto.js.map