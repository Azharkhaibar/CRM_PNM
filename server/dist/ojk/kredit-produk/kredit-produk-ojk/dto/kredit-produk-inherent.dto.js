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
exports.ImportExportDto = exports.ExportNilaiDto = exports.ExportParameterDto = exports.ExportImportMetadataDto = exports.UpdateSummaryDto = exports.ReorderNilaiDto = exports.ReorderParametersDto = exports.UpdateNilaiDto = exports.CreateNilaiDto = exports.UpdateParameterDto = exports.CreateParameterDto = exports.UpdateKreditProdukInherentDto = exports.CreateKreditProdukInherentDto = exports.RiskindikatorDto = exports.JudulDto = exports.KategoriDto = exports.JudulType = exports.KategoriJenis = exports.KategoriPrinsip = exports.KategoriUnderlying = exports.KategoriModel = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var KategoriModel;
(function (KategoriModel) {
    KategoriModel["TANPA_MODEL"] = "tanpa_model";
    KategoriModel["OPEN_END"] = "open_end";
    KategoriModel["TERSTRUKTUR"] = "terstruktur";
})(KategoriModel || (exports.KategoriModel = KategoriModel = {}));
var KategoriUnderlying;
(function (KategoriUnderlying) {
    KategoriUnderlying["INDEKS"] = "indeks";
    KategoriUnderlying["EBA"] = "eba";
    KategoriUnderlying["DINFRA"] = "dinfra";
    KategoriUnderlying["OBLIGASI"] = "obligasi";
})(KategoriUnderlying || (exports.KategoriUnderlying = KategoriUnderlying = {}));
var KategoriPrinsip;
(function (KategoriPrinsip) {
    KategoriPrinsip["SYARIAH"] = "syariah";
    KategoriPrinsip["KONVENSIONAL"] = "konvensional";
})(KategoriPrinsip || (exports.KategoriPrinsip = KategoriPrinsip = {}));
var KategoriJenis;
(function (KategoriJenis) {
    KategoriJenis["PASAR_UANG"] = "pasar_uang";
    KategoriJenis["PENDAPATAN_TETAP"] = "pendapatan_tetap";
    KategoriJenis["CAMPURAN"] = "campuran";
    KategoriJenis["SAHAM"] = "saham";
    KategoriJenis["INDEKS"] = "indeks";
    KategoriJenis["TERPROTEKSI"] = "terproteksi";
})(KategoriJenis || (exports.KategoriJenis = KategoriJenis = {}));
var JudulType;
(function (JudulType) {
    JudulType["TANPA_FAKTOR"] = "Tanpa Faktor";
    JudulType["SATU_FAKTOR"] = "Satu Faktor";
    JudulType["DUA_FAKTOR"] = "Dua Faktor";
})(JudulType || (exports.JudulType = JudulType = {}));
class KategoriDto {
    model;
    prinsip;
    jenis;
    underlying;
}
exports.KategoriDto = KategoriDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['tanpa_model', 'open_end', 'terstruktur'], {
        message: 'Model harus salah satu dari: tanpa_model, open_end, terstruktur',
    }),
    __metadata("design:type", String)
], KategoriDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['syariah', 'konvensional'], {
        message: 'Prinsip harus salah satu dari: syariah, konvensional',
    }),
    __metadata("design:type", String)
], KategoriDto.prototype, "prinsip", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)([
        'pasar_uang',
        'pendapatan_tetap',
        'campuran',
        'saham',
        'indeks',
        'terproteksi',
    ], {
        message: 'Jenis harus salah satu dari: pasar_uang, pendapatan_tetap, campuran, saham, indeks, terproteksi',
    }),
    __metadata("design:type", String)
], KategoriDto.prototype, "jenis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsIn)(['indeks', 'eba', 'dinfra', 'obligasi'], { each: true }),
    __metadata("design:type", Array)
], KategoriDto.prototype, "underlying", void 0);
class JudulDto {
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
exports.JudulDto = JudulDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(JudulType),
    __metadata("design:type", String)
], JudulDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JudulDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JudulDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JudulDto.prototype, "pembilang", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JudulDto.prototype, "valuePembilang", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JudulDto.prototype, "penyebut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JudulDto.prototype, "valuePenyebut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JudulDto.prototype, "formula", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], JudulDto.prototype, "percent", void 0);
class RiskindikatorDto {
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
}
exports.RiskindikatorDto = RiskindikatorDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskindikatorDto.prototype, "low", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskindikatorDto.prototype, "lowToModerate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskindikatorDto.prototype, "moderate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskindikatorDto.prototype, "moderateToHigh", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskindikatorDto.prototype, "high", void 0);
class CreateKreditProdukInherentDto {
    year;
    quarter;
    isActive;
    createdBy;
    version;
}
exports.CreateKreditProdukInherentDto = CreateKreditProdukInherentDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], CreateKreditProdukInherentDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], CreateKreditProdukInherentDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateKreditProdukInherentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKreditProdukInherentDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKreditProdukInherentDto.prototype, "version", void 0);
class UpdateKreditProdukInherentDto {
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
exports.UpdateKreditProdukInherentDto = UpdateKreditProdukInherentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], UpdateKreditProdukInherentDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], UpdateKreditProdukInherentDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKreditProdukInherentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateKreditProdukInherentDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKreditProdukInherentDto.prototype, "isLocked", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKreditProdukInherentDto.prototype, "lockedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateKreditProdukInherentDto.prototype, "lockedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKreditProdukInherentDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKreditProdukInherentDto.prototype, "updatedBy", void 0);
class CreateParameterDto {
    nomor;
    judul;
    bobot;
    kategori;
    orderIndex;
}
exports.CreateParameterDto = CreateParameterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateParameterDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateParameterDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateParameterDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KategoriDto),
    __metadata("design:type", KategoriDto)
], CreateParameterDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateParameterDto.prototype, "orderIndex", void 0);
class UpdateParameterDto {
    nomor;
    judul;
    bobot;
    kategori;
    orderIndex;
}
exports.UpdateParameterDto = UpdateParameterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateParameterDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateParameterDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateParameterDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KategoriDto),
    __metadata("design:type", KategoriDto)
], UpdateParameterDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateParameterDto.prototype, "orderIndex", void 0);
class CreateNilaiDto {
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    orderIndex;
}
exports.CreateNilaiDto = CreateNilaiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNilaiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => JudulDto),
    __metadata("design:type", JudulDto)
], CreateNilaiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateNilaiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNilaiDto.prototype, "portofolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNilaiDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RiskindikatorDto),
    __metadata("design:type", RiskindikatorDto)
], CreateNilaiDto.prototype, "riskindikator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNilaiDto.prototype, "orderIndex", void 0);
class UpdateNilaiDto {
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    orderIndex;
}
exports.UpdateNilaiDto = UpdateNilaiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNilaiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => JudulDto),
    __metadata("design:type", JudulDto)
], UpdateNilaiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateNilaiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNilaiDto.prototype, "portofolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNilaiDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RiskindikatorDto),
    __metadata("design:type", RiskindikatorDto)
], UpdateNilaiDto.prototype, "riskindikator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateNilaiDto.prototype, "orderIndex", void 0);
class ReorderParametersDto {
    parameterIds;
}
exports.ReorderParametersDto = ReorderParametersDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ReorderParametersDto.prototype, "parameterIds", void 0);
class ReorderNilaiDto {
    nilaiIds;
}
exports.ReorderNilaiDto = ReorderNilaiDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ReorderNilaiDto.prototype, "nilaiIds", void 0);
class UpdateSummaryDto {
    totalWeighted;
    summaryBg;
    computedAt;
}
exports.UpdateSummaryDto = UpdateSummaryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSummaryDto.prototype, "totalWeighted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSummaryDto.prototype, "summaryBg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateSummaryDto.prototype, "computedAt", void 0);
class ExportImportMetadataDto {
    year;
    quarter;
    exportedAt;
    totalParameters;
    totalNilai;
}
exports.ExportImportMetadataDto = ExportImportMetadataDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], ExportImportMetadataDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], ExportImportMetadataDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportImportMetadataDto.prototype, "exportedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExportImportMetadataDto.prototype, "totalParameters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExportImportMetadataDto.prototype, "totalNilai", void 0);
class ExportParameterDto {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    orderIndex;
    nilaiList;
}
exports.ExportParameterDto = ExportParameterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ExportParameterDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportParameterDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportParameterDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ExportParameterDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KategoriDto),
    __metadata("design:type", KategoriDto)
], ExportParameterDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ExportParameterDto.prototype, "orderIndex", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExportNilaiDto),
    __metadata("design:type", Array)
], ExportParameterDto.prototype, "nilaiList", void 0);
class ExportNilaiDto {
    id;
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    orderIndex;
}
exports.ExportNilaiDto = ExportNilaiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ExportNilaiDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportNilaiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => JudulDto),
    __metadata("design:type", JudulDto)
], ExportNilaiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ExportNilaiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportNilaiDto.prototype, "portofolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportNilaiDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RiskindikatorDto),
    __metadata("design:type", RiskindikatorDto)
], ExportNilaiDto.prototype, "riskindikator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ExportNilaiDto.prototype, "orderIndex", void 0);
class ImportExportDto {
    metadata;
    parameters;
}
exports.ImportExportDto = ImportExportDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ExportImportMetadataDto),
    __metadata("design:type", ExportImportMetadataDto)
], ImportExportDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExportParameterDto),
    __metadata("design:type", Array)
], ImportExportDto.prototype, "parameters", void 0);
//# sourceMappingURL=kredit-produk-inherent.dto.js.map