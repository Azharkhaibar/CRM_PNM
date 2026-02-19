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
exports.LikuiditasImportExportDto = exports.LikuiditasExportNilaiDto = exports.LikuiditasExportParameterDto = exports.LikuiditasExportImportMetadataDto = exports.UpdateLikuiditasSummaryDto = exports.ReorderLikuiditasNilaiDto = exports.ReorderLikuiditasParametersDto = exports.UpdateLikuiditasNilaiDto = exports.CreateLikuiditasNilaiDto = exports.UpdateLikuiditasParameterDto = exports.CreateLikuiditasParameterDto = exports.UpdateLikuiditasProdukInherentDto = exports.CreateLikuiditasProdukInherentDto = exports.LikuiditasRiskindikatorDto = exports.LikuiditasJudulDto = exports.LikuiditasKategoriDto = exports.LikuiditasJudulType = exports.LikuiditasKategoriJenis = exports.LikuiditasKategoriPrinsip = exports.LikuiditasKategoriUnderlying = exports.LikuiditasKategoriModel = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var LikuiditasKategoriModel;
(function (LikuiditasKategoriModel) {
    LikuiditasKategoriModel["TANPA_MODEL"] = "tanpa_model";
    LikuiditasKategoriModel["STANDAR"] = "standar";
    LikuiditasKategoriModel["KOMPREHENSIF"] = "komprehensif";
})(LikuiditasKategoriModel || (exports.LikuiditasKategoriModel = LikuiditasKategoriModel = {}));
var LikuiditasKategoriUnderlying;
(function (LikuiditasKategoriUnderlying) {
    LikuiditasKategoriUnderlying["KEWAJIBAN"] = "kewajiban";
    LikuiditasKategoriUnderlying["ASET_LANCAR"] = "aset_lancar";
    LikuiditasKategoriUnderlying["ARUS_KAS"] = "arus_kas";
    LikuiditasKategoriUnderlying["RASIO"] = "rasio";
})(LikuiditasKategoriUnderlying || (exports.LikuiditasKategoriUnderlying = LikuiditasKategoriUnderlying = {}));
var LikuiditasKategoriPrinsip;
(function (LikuiditasKategoriPrinsip) {
    LikuiditasKategoriPrinsip["SYARIAH"] = "syariah";
    LikuiditasKategoriPrinsip["KONVENSIONAL"] = "konvensional";
})(LikuiditasKategoriPrinsip || (exports.LikuiditasKategoriPrinsip = LikuiditasKategoriPrinsip = {}));
var LikuiditasKategoriJenis;
(function (LikuiditasKategoriJenis) {
    LikuiditasKategoriJenis["JANGKA_PENDEK"] = "jangka_pendek";
    LikuiditasKategoriJenis["JANGKA_MENENGAH"] = "jangka_menengah";
    LikuiditasKategoriJenis["JANGKA_PANJANG"] = "jangka_panjang";
})(LikuiditasKategoriJenis || (exports.LikuiditasKategoriJenis = LikuiditasKategoriJenis = {}));
var LikuiditasJudulType;
(function (LikuiditasJudulType) {
    LikuiditasJudulType["TANPA_FAKTOR"] = "Tanpa Faktor";
    LikuiditasJudulType["SATU_FAKTOR"] = "Satu Faktor";
    LikuiditasJudulType["DUA_FAKTOR"] = "Dua Faktor";
})(LikuiditasJudulType || (exports.LikuiditasJudulType = LikuiditasJudulType = {}));
class LikuiditasKategoriDto {
    model;
    prinsip;
    jenis;
    underlying;
}
exports.LikuiditasKategoriDto = LikuiditasKategoriDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['tanpa_model', 'standar', 'komprehensif'], {
        message: 'Model harus salah satu dari: tanpa_model, standar, komprehensif',
    }),
    __metadata("design:type", String)
], LikuiditasKategoriDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['syariah', 'konvensional'], {
        message: 'Prinsip harus salah satu dari: syariah, konvensional',
    }),
    __metadata("design:type", String)
], LikuiditasKategoriDto.prototype, "prinsip", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['jangka_pendek', 'jangka_menengah', 'jangka_panjang'], {
        message: 'Jenis harus salah satu dari: jangka_pendek, jangka_menengah, jangka_panjang',
    }),
    __metadata("design:type", String)
], LikuiditasKategoriDto.prototype, "jenis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsIn)(['kewajiban', 'aset_lancar', 'arus_kas', 'rasio'], { each: true }),
    __metadata("design:type", Array)
], LikuiditasKategoriDto.prototype, "underlying", void 0);
class LikuiditasJudulDto {
    type;
    text;
    value;
    pembilang;
    valuePembilang;
    penyebut;
    valuePenyebut;
    formula;
    percent;
}
exports.LikuiditasJudulDto = LikuiditasJudulDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LikuiditasJudulType),
    __metadata("design:type", String)
], LikuiditasJudulDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasJudulDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LikuiditasJudulDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasJudulDto.prototype, "pembilang", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LikuiditasJudulDto.prototype, "valuePembilang", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasJudulDto.prototype, "penyebut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LikuiditasJudulDto.prototype, "valuePenyebut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasJudulDto.prototype, "formula", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LikuiditasJudulDto.prototype, "percent", void 0);
class LikuiditasRiskindikatorDto {
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
}
exports.LikuiditasRiskindikatorDto = LikuiditasRiskindikatorDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasRiskindikatorDto.prototype, "low", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasRiskindikatorDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasRiskindikatorDto.prototype, "moderate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasRiskindikatorDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasRiskindikatorDto.prototype, "high", void 0);
class CreateLikuiditasProdukInherentDto {
    year;
    quarter;
    isActive;
    createdBy;
    version;
}
exports.CreateLikuiditasProdukInherentDto = CreateLikuiditasProdukInherentDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], CreateLikuiditasProdukInherentDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], CreateLikuiditasProdukInherentDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLikuiditasProdukInherentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLikuiditasProdukInherentDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLikuiditasProdukInherentDto.prototype, "version", void 0);
class UpdateLikuiditasProdukInherentDto {
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
exports.UpdateLikuiditasProdukInherentDto = UpdateLikuiditasProdukInherentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], UpdateLikuiditasProdukInherentDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], UpdateLikuiditasProdukInherentDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLikuiditasProdukInherentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateLikuiditasProdukInherentDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLikuiditasProdukInherentDto.prototype, "isLocked", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasProdukInherentDto.prototype, "lockedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateLikuiditasProdukInherentDto.prototype, "lockedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasProdukInherentDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasProdukInherentDto.prototype, "updatedBy", void 0);
class CreateLikuiditasParameterDto {
    nomor;
    judul;
    bobot;
    kategori;
    orderIndex;
}
exports.CreateLikuiditasParameterDto = CreateLikuiditasParameterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLikuiditasParameterDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLikuiditasParameterDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateLikuiditasParameterDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasKategoriDto),
    __metadata("design:type", LikuiditasKategoriDto)
], CreateLikuiditasParameterDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLikuiditasParameterDto.prototype, "orderIndex", void 0);
class UpdateLikuiditasParameterDto {
    nomor;
    judul;
    bobot;
    kategori;
    orderIndex;
}
exports.UpdateLikuiditasParameterDto = UpdateLikuiditasParameterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasParameterDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateLikuiditasParameterDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateLikuiditasParameterDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasKategoriDto),
    __metadata("design:type", LikuiditasKategoriDto)
], UpdateLikuiditasParameterDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateLikuiditasParameterDto.prototype, "orderIndex", void 0);
class CreateLikuiditasNilaiDto {
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    orderIndex;
}
exports.CreateLikuiditasNilaiDto = CreateLikuiditasNilaiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLikuiditasNilaiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasJudulDto),
    __metadata("design:type", LikuiditasJudulDto)
], CreateLikuiditasNilaiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateLikuiditasNilaiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLikuiditasNilaiDto.prototype, "portofolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLikuiditasNilaiDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasRiskindikatorDto),
    __metadata("design:type", LikuiditasRiskindikatorDto)
], CreateLikuiditasNilaiDto.prototype, "riskindikator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLikuiditasNilaiDto.prototype, "orderIndex", void 0);
class UpdateLikuiditasNilaiDto {
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    orderIndex;
}
exports.UpdateLikuiditasNilaiDto = UpdateLikuiditasNilaiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasNilaiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasJudulDto),
    __metadata("design:type", LikuiditasJudulDto)
], UpdateLikuiditasNilaiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateLikuiditasNilaiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasNilaiDto.prototype, "portofolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasNilaiDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasRiskindikatorDto),
    __metadata("design:type", LikuiditasRiskindikatorDto)
], UpdateLikuiditasNilaiDto.prototype, "riskindikator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateLikuiditasNilaiDto.prototype, "orderIndex", void 0);
class ReorderLikuiditasParametersDto {
    parameterIds;
}
exports.ReorderLikuiditasParametersDto = ReorderLikuiditasParametersDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ReorderLikuiditasParametersDto.prototype, "parameterIds", void 0);
class ReorderLikuiditasNilaiDto {
    nilaiIds;
}
exports.ReorderLikuiditasNilaiDto = ReorderLikuiditasNilaiDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ReorderLikuiditasNilaiDto.prototype, "nilaiIds", void 0);
class UpdateLikuiditasSummaryDto {
    totalWeighted;
    summaryBg;
    computedAt;
}
exports.UpdateLikuiditasSummaryDto = UpdateLikuiditasSummaryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLikuiditasSummaryDto.prototype, "totalWeighted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLikuiditasSummaryDto.prototype, "summaryBg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateLikuiditasSummaryDto.prototype, "computedAt", void 0);
class LikuiditasExportImportMetadataDto {
    year;
    quarter;
    exportedAt;
    totalParameters;
    totalNilai;
}
exports.LikuiditasExportImportMetadataDto = LikuiditasExportImportMetadataDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], LikuiditasExportImportMetadataDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], LikuiditasExportImportMetadataDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasExportImportMetadataDto.prototype, "exportedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LikuiditasExportImportMetadataDto.prototype, "totalParameters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LikuiditasExportImportMetadataDto.prototype, "totalNilai", void 0);
class LikuiditasExportParameterDto {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    orderIndex;
    nilaiList;
}
exports.LikuiditasExportParameterDto = LikuiditasExportParameterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], LikuiditasExportParameterDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasExportParameterDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasExportParameterDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], LikuiditasExportParameterDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasKategoriDto),
    __metadata("design:type", LikuiditasKategoriDto)
], LikuiditasExportParameterDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], LikuiditasExportParameterDto.prototype, "orderIndex", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => LikuiditasExportNilaiDto),
    __metadata("design:type", Array)
], LikuiditasExportParameterDto.prototype, "nilaiList", void 0);
class LikuiditasExportNilaiDto {
    id;
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    orderIndex;
}
exports.LikuiditasExportNilaiDto = LikuiditasExportNilaiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], LikuiditasExportNilaiDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasExportNilaiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasJudulDto),
    __metadata("design:type", LikuiditasJudulDto)
], LikuiditasExportNilaiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], LikuiditasExportNilaiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasExportNilaiDto.prototype, "portofolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LikuiditasExportNilaiDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasRiskindikatorDto),
    __metadata("design:type", LikuiditasRiskindikatorDto)
], LikuiditasExportNilaiDto.prototype, "riskindikator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], LikuiditasExportNilaiDto.prototype, "orderIndex", void 0);
class LikuiditasImportExportDto {
    metadata;
    parameters;
}
exports.LikuiditasImportExportDto = LikuiditasImportExportDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LikuiditasExportImportMetadataDto),
    __metadata("design:type", LikuiditasExportImportMetadataDto)
], LikuiditasImportExportDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => LikuiditasExportParameterDto),
    __metadata("design:type", Array)
], LikuiditasImportExportDto.prototype, "parameters", void 0);
//# sourceMappingURL=likuditas-produk-inherent.dto.js.map