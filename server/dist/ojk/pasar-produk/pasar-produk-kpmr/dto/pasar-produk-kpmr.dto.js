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
exports.UpdateSummaryDto = exports.BulkUpdateSkorDto = exports.SkorUpdateItemDto = exports.UpdateSkorDto = exports.ReorderPertanyaanDto = exports.ReorderAspekDto = exports.FrontendPertanyaanResponseDto = exports.FrontendAspekResponseDto = exports.FrontendKpmrResponseDto = exports.UpdateKpmrPertanyaanPasarDto = exports.CreateKpmrPertanyaanPasarDto = exports.UpdateKpmrAspekPasarDto = exports.CreateKpmrAspekPasarDto = exports.UpdateKpmrPasarOjkDto = exports.CreateKpmrPasarOjkDto = exports.KpmrSummaryDto = exports.KpmrIndicatorDto = exports.KpmrSkorDto = exports.RatingEnum = exports.QuarterEnum = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var QuarterEnum;
(function (QuarterEnum) {
    QuarterEnum["Q1"] = "Q1";
    QuarterEnum["Q2"] = "Q2";
    QuarterEnum["Q3"] = "Q3";
    QuarterEnum["Q4"] = "Q4";
})(QuarterEnum || (exports.QuarterEnum = QuarterEnum = {}));
var RatingEnum;
(function (RatingEnum) {
    RatingEnum["STRONG"] = "Strong";
    RatingEnum["SATISFACTORY"] = "Satisfactory";
    RatingEnum["FAIR"] = "Fair";
    RatingEnum["MARGINAL"] = "Marginal";
    RatingEnum["UNSATISFACTORY"] = "Unsatisfactory";
})(RatingEnum || (exports.RatingEnum = RatingEnum = {}));
const transformNumber = ({ value }) => {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    if (value === 'undefined' || value === 'null') {
        return undefined;
    }
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
        return value;
    }
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) {
        return undefined;
    }
    return num;
};
const transformQuarter = ({ value }) => {
    if (!value && value !== 0)
        return undefined;
    if (typeof value === 'string') {
        const upper = value.trim().toUpperCase();
        if (['Q1', 'Q2', 'Q3', 'Q4'].includes(upper)) {
            return upper;
        }
    }
    const num = Number(value);
    if (!isNaN(num) && num >= 1 && num <= 4) {
        return `Q${num}`;
    }
    if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 4) {
            return `Q${parsed}`;
        }
    }
    return undefined;
};
const transformIdToString = ({ value }) => {
    if (value === null || value === undefined)
        return undefined;
    return value.toString();
};
class KpmrSkorDto {
    Q1;
    Q2;
    Q3;
    Q4;
}
exports.KpmrSkorDto = KpmrSkorDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor Q1', example: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor Q2', example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor Q3', example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q3", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor Q4', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q4", void 0);
class KpmrIndicatorDto {
    strong;
    satisfactory;
    fair;
    marginal;
    unsatisfactory;
}
exports.KpmrIndicatorDto = KpmrIndicatorDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi untuk skor 1 (Strong)',
        example: 'Sangat baik...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "strong", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi untuk skor 2 (Satisfactory)',
        example: 'Memuaskan...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "satisfactory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi untuk skor 3 (Fair)',
        example: 'Cukup...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "fair", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi untuk skor 4 (Marginal)',
        example: 'Marginal...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "marginal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi untuk skor 5 (Unsatisfactory)',
        example: 'Tidak memuaskan...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "unsatisfactory", void 0);
class KpmrSummaryDto {
    totalScore;
    averageScore;
    rating;
    computedAt;
}
exports.KpmrSummaryDto = KpmrSummaryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total skor', example: 85.5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KpmrSummaryDto.prototype, "totalScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rata-rata skor', example: 3.42 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KpmrSummaryDto.prototype, "averageScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rating',
        enum: RatingEnum,
        example: 'Fair',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RatingEnum),
    __metadata("design:type", String)
], KpmrSummaryDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tanggal perhitungan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], KpmrSummaryDto.prototype, "computedAt", void 0);
class CreateKpmrPasarOjkDto {
    year;
    quarter;
    isActive;
    createdBy;
    version;
    notes;
    summary;
    aspekList;
}
exports.CreateKpmrPasarOjkDto = CreateKpmrPasarOjkDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tahun KPMR', example: 2024 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], CreateKpmrPasarOjkDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quarter (1-4)', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], CreateKpmrPasarOjkDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Apakah aktif', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateKpmrPasarOjkDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dibuat oleh', example: 'admin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPasarOjkDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Versi template', example: '1.0.0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPasarOjkDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Catatan tambahan',
        example: 'Initial data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPasarOjkDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Summary data', type: KpmrSummaryDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrSummaryDto),
    __metadata("design:type", KpmrSummaryDto)
], CreateKpmrPasarOjkDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => [CreateKpmrAspekPasarDto],
        description: 'Daftar aspek',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateKpmrAspekPasarDto),
    __metadata("design:type", Array)
], CreateKpmrPasarOjkDto.prototype, "aspekList", void 0);
class UpdateKpmrPasarOjkDto {
    year;
    quarter;
    isActive;
    summary;
    isLocked;
    lockedBy;
    lockedAt;
    notes;
    updatedBy;
}
exports.UpdateKpmrPasarOjkDto = UpdateKpmrPasarOjkDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tahun KPMR', example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], UpdateKpmrPasarOjkDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quarter (1-4)', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], UpdateKpmrPasarOjkDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Apakah aktif', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKpmrPasarOjkDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Summary data', type: KpmrSummaryDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrSummaryDto),
    __metadata("design:type", KpmrSummaryDto)
], UpdateKpmrPasarOjkDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Apakah terkunci', example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKpmrPasarOjkDto.prototype, "isLocked", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dikunci oleh', example: 'supervisor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPasarOjkDto.prototype, "lockedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tanggal terkunci' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateKpmrPasarOjkDto.prototype, "lockedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Catatan tambahan',
        example: 'Perubahan data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPasarOjkDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diupdate oleh', example: 'admin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPasarOjkDto.prototype, "updatedBy", void 0);
class CreateKpmrAspekPasarDto {
    nomor;
    judul;
    bobot;
    deskripsi;
    kpmrOjkId;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
    pertanyaanList;
}
exports.CreateKpmrAspekPasarDto = CreateKpmrAspekPasarDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor aspek', example: '1.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrAspekPasarDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Judul aspek',
        example: 'Governance & Leadership',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKpmrAspekPasarDto.prototype, "judul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bobot aspek dalam persen', example: 25.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], CreateKpmrAspekPasarDto.prototype, "bobot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi aspek',
        example: 'Penilaian governance...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateKpmrAspekPasarDto.prototype, "deskripsi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID KPMR OJK (jika bukan nested create)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateKpmrAspekPasarDto.prototype, "kpmrOjkId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index urutan', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateKpmrAspekPasarDto.prototype, "orderIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor rata-rata', example: 3.75 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateKpmrAspekPasarDto.prototype, "averageScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rating',
        example: 'Fair',
        enum: RatingEnum,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RatingEnum),
    __metadata("design:type", String)
], CreateKpmrAspekPasarDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diupdate oleh', example: 'admin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrAspekPasarDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan', example: 'Perlu perbaikan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrAspekPasarDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => [CreateKpmrPertanyaanPasarDto],
        description: 'Daftar pertanyaan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateKpmrPertanyaanPasarDto),
    __metadata("design:type", Array)
], CreateKpmrAspekPasarDto.prototype, "pertanyaanList", void 0);
class UpdateKpmrAspekPasarDto {
    nomor;
    judul;
    bobot;
    deskripsi;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
}
exports.UpdateKpmrAspekPasarDto = UpdateKpmrAspekPasarDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor aspek', example: '1.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekPasarDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Judul aspek',
        example: 'Governance & Leadership',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateIf)((o) => o.judul !== undefined),
    __metadata("design:type", String)
], UpdateKpmrAspekPasarDto.prototype, "judul", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bobot aspek dalam persen',
        example: 25.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateKpmrAspekPasarDto.prototype, "bobot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deskripsi aspek',
        example: 'Penilaian governance...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateKpmrAspekPasarDto.prototype, "deskripsi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index urutan', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateKpmrAspekPasarDto.prototype, "orderIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor rata-rata', example: 3.75 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateKpmrAspekPasarDto.prototype, "averageScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rating',
        example: 'Fair',
        enum: RatingEnum,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RatingEnum),
    __metadata("design:type", String)
], UpdateKpmrAspekPasarDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diupdate oleh', example: 'admin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekPasarDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan', example: 'Perlu perbaikan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekPasarDto.prototype, "notes", void 0);
class CreateKpmrPertanyaanPasarDto {
    nomor;
    pertanyaan;
    skor;
    indicator;
    evidence;
    catatan;
    aspekId;
    orderIndex;
}
exports.CreateKpmrPertanyaanPasarDto = CreateKpmrPertanyaanPasarDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor pertanyaan', example: '1.1.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanPasarDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teks pertanyaan',
        example: 'Apakah dewan direksi memiliki komitmen terhadap manajemen risiko?',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanPasarDto.prototype, "pertanyaan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor per quarter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrSkorDto),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return {};
        const result = {};
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach((q) => {
            result[q] = value[q] ?? undefined;
        });
        return result;
    }, { toClassOnly: true }),
    __metadata("design:type", KpmrSkorDto)
], CreateKpmrPertanyaanPasarDto.prototype, "skor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Indicator/description level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrIndicatorDto),
    __metadata("design:type", KpmrIndicatorDto)
], CreateKpmrPertanyaanPasarDto.prototype, "indicator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence/bukti',
        example: 'Dokumen kebijakan...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanPasarDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Catatan',
        example: 'Perlu dokumen tambahan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateKpmrPertanyaanPasarDto.prototype, "catatan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID Aspek (jika bukan nested create)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateKpmrPertanyaanPasarDto.prototype, "aspekId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index urutan', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateKpmrPertanyaanPasarDto.prototype, "orderIndex", void 0);
class UpdateKpmrPertanyaanPasarDto {
    nomor;
    pertanyaan;
    skor;
    indicator;
    evidence;
    catatan;
    orderIndex;
}
exports.UpdateKpmrPertanyaanPasarDto = UpdateKpmrPertanyaanPasarDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor pertanyaan', example: '1.1.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanPasarDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Teks pertanyaan',
        example: 'Apakah dewan direksi memiliki komitmen terhadap manajemen risiko?',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateIf)((o) => o.pertanyaan !== undefined),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanPasarDto.prototype, "pertanyaan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor per quarter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrSkorDto),
    __metadata("design:type", KpmrSkorDto)
], UpdateKpmrPertanyaanPasarDto.prototype, "skor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Indicator/description level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrIndicatorDto),
    __metadata("design:type", KpmrIndicatorDto)
], UpdateKpmrPertanyaanPasarDto.prototype, "indicator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence/bukti',
        example: 'Dokumen kebijakan...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanPasarDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Catatan',
        example: 'Perlu dokumen tambahan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanPasarDto.prototype, "catatan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index urutan', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateKpmrPertanyaanPasarDto.prototype, "orderIndex", void 0);
class FrontendKpmrResponseDto {
    id;
    year;
    quarter;
    isActive;
    isLocked;
    version;
    notes;
    summary;
    aspekList;
}
exports.FrontendKpmrResponseDto = FrontendKpmrResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID KPMR' }),
    (0, class_transformer_1.Transform)(transformIdToString),
    __metadata("design:type", String)
], FrontendKpmrResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tahun', example: 2024 }),
    __metadata("design:type", Number)
], FrontendKpmrResponseDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quarter', example: 1 }),
    __metadata("design:type", Number)
], FrontendKpmrResponseDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Apakah aktif', example: true }),
    __metadata("design:type", Boolean)
], FrontendKpmrResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Apakah terkunci', example: false }),
    __metadata("design:type", Boolean)
], FrontendKpmrResponseDto.prototype, "isLocked", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Versi template', example: '1.0.0' }),
    __metadata("design:type", String)
], FrontendKpmrResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan tambahan' }),
    __metadata("design:type", String)
], FrontendKpmrResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Summary data', type: KpmrSummaryDto }),
    __metadata("design:type", KpmrSummaryDto)
], FrontendKpmrResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Daftar aspek' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.map((aspek) => (0, class_transformer_1.plainToInstance)(FrontendAspekResponseDto, aspek))),
    __metadata("design:type", Array)
], FrontendKpmrResponseDto.prototype, "aspekList", void 0);
class FrontendAspekResponseDto {
    id;
    nomor;
    judul;
    bobot;
    deskripsi;
    orderIndex;
    averageScore;
    rating;
    pertanyaanList;
}
exports.FrontendAspekResponseDto = FrontendAspekResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID Aspek' }),
    (0, class_transformer_1.Transform)(transformIdToString),
    __metadata("design:type", String)
], FrontendAspekResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor aspek', example: '1.1' }),
    __metadata("design:type", String)
], FrontendAspekResponseDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Judul aspek', example: 'Governance' }),
    __metadata("design:type", String)
], FrontendAspekResponseDto.prototype, "judul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bobot aspek', example: '25.5' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], FrontendAspekResponseDto.prototype, "bobot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deskripsi aspek' }),
    __metadata("design:type", String)
], FrontendAspekResponseDto.prototype, "deskripsi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index urutan', example: 0 }),
    __metadata("design:type", Number)
], FrontendAspekResponseDto.prototype, "orderIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor rata-rata', example: 3.75 }),
    __metadata("design:type", Number)
], FrontendAspekResponseDto.prototype, "averageScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rating',
        example: 'Fair',
        enum: RatingEnum,
    }),
    __metadata("design:type", String)
], FrontendAspekResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Daftar pertanyaan' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.map((q) => (0, class_transformer_1.plainToInstance)(FrontendPertanyaanResponseDto, q))),
    __metadata("design:type", Array)
], FrontendAspekResponseDto.prototype, "pertanyaanList", void 0);
class FrontendPertanyaanResponseDto {
    id;
    nomor;
    pertanyaan;
    skor;
    indicator;
    evidence;
    catatan;
    orderIndex;
}
exports.FrontendPertanyaanResponseDto = FrontendPertanyaanResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID Pertanyaan' }),
    (0, class_transformer_1.Transform)(transformIdToString),
    __metadata("design:type", String)
], FrontendPertanyaanResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor pertanyaan', example: '1.1.1' }),
    __metadata("design:type", String)
], FrontendPertanyaanResponseDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pertanyaan' }),
    __metadata("design:type", String)
], FrontendPertanyaanResponseDto.prototype, "pertanyaan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor per quarter' }),
    (0, class_transformer_1.Transform)(({ value }) => ({
        Q1: value?.Q1 ?? undefined,
        Q2: value?.Q2 ?? undefined,
        Q3: value?.Q3 ?? undefined,
        Q4: value?.Q4 ?? undefined,
    })),
    __metadata("design:type", Object)
], FrontendPertanyaanResponseDto.prototype, "skor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indicator/description level',
        type: KpmrIndicatorDto,
    }),
    __metadata("design:type", KpmrIndicatorDto)
], FrontendPertanyaanResponseDto.prototype, "indicator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Evidence/bukti' }),
    __metadata("design:type", String)
], FrontendPertanyaanResponseDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan' }),
    __metadata("design:type", String)
], FrontendPertanyaanResponseDto.prototype, "catatan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Index urutan', example: 0 }),
    __metadata("design:type", Number)
], FrontendPertanyaanResponseDto.prototype, "orderIndex", void 0);
class ReorderAspekDto {
    aspekIds;
}
exports.ReorderAspekDto = ReorderAspekDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array ID aspek dalam urutan baru' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsPositive)({ each: true }),
    __metadata("design:type", Array)
], ReorderAspekDto.prototype, "aspekIds", void 0);
class ReorderPertanyaanDto {
    pertanyaanIds;
}
exports.ReorderPertanyaanDto = ReorderPertanyaanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array ID pertanyaan dalam urutan baru' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsPositive)({ each: true }),
    __metadata("design:type", Array)
], ReorderPertanyaanDto.prototype, "pertanyaanIds", void 0);
class UpdateSkorDto {
    quarter;
    skor;
    updatedBy;
}
exports.UpdateSkorDto = UpdateSkorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quarter yang diupdate', example: 'Q1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Q1', 'Q2', 'Q3', 'Q4']),
    (0, class_transformer_1.Transform)(transformQuarter),
    __metadata("design:type", String)
], UpdateSkorDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nilai skor (1-5)', example: 4 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], UpdateSkorDto.prototype, "skor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diupdate oleh', example: 'reviewer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSkorDto.prototype, "updatedBy", void 0);
class SkorUpdateItemDto {
    pertanyaanId;
    quarter;
    skor;
}
exports.SkorUpdateItemDto = SkorUpdateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID Pertanyaan' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], SkorUpdateItemDto.prototype, "pertanyaanId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quarter', example: 'Q1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Q1', 'Q2', 'Q3', 'Q4']),
    (0, class_transformer_1.Transform)(transformQuarter),
    __metadata("design:type", String)
], SkorUpdateItemDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nilai skor' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Transform)(transformNumber),
    __metadata("design:type", Number)
], SkorUpdateItemDto.prototype, "skor", void 0);
class BulkUpdateSkorDto {
    updates;
}
exports.BulkUpdateSkorDto = BulkUpdateSkorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [SkorUpdateItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SkorUpdateItemDto),
    __metadata("design:type", Array)
], BulkUpdateSkorDto.prototype, "updates", void 0);
class UpdateSummaryDto {
    totalScore;
    averageScore;
    rating;
    computedAt;
}
exports.UpdateSummaryDto = UpdateSummaryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total skor', example: 85.5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSummaryDto.prototype, "totalScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rata-rata skor', example: 3.42 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSummaryDto.prototype, "averageScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rating',
        enum: RatingEnum,
        example: 'Fair',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RatingEnum),
    __metadata("design:type", String)
], UpdateSummaryDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tanggal perhitungan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateSummaryDto.prototype, "computedAt", void 0);
//# sourceMappingURL=pasar-produk-kpmr.dto.js.map