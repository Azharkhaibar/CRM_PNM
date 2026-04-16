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
exports.RiskindikatorDto = exports.JudulDto = exports.KategoriDto = exports.FrontendKpmrResponseDto = exports.FrontendAspekResponseDto = exports.FrontendPertanyaanResponseDto = exports.UpdateSummaryDto = exports.ReorderPertanyaanDto = exports.ReorderAspekDto = exports.BulkUpdateSkorDto = exports.BulkUpdateItemDto = exports.UpdateSkorDto = exports.UpdateKpmrPertanyaanKonsentrasiDto = exports.UpdateKpmrAspekKonsentrasiDto = exports.UpdateKpmrKonsentrasiOjkDto = exports.CreateKpmrPertanyaanKonsentrasiDto = exports.CreateKpmrAspekKonsentrasiDto = exports.CreateKpmrKonsentrasiOjkDto = exports.KpmrIndicatorDto = exports.KpmrSkorDto = exports.KpmrQuarterEnum = exports.JudulType = exports.KategoriJenis = exports.KategoriPrinsip = exports.KategoriUnderlying = exports.KategoriModel = void 0;
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
var KpmrQuarterEnum;
(function (KpmrQuarterEnum) {
    KpmrQuarterEnum["Q1"] = "Q1";
    KpmrQuarterEnum["Q2"] = "Q2";
    KpmrQuarterEnum["Q3"] = "Q3";
    KpmrQuarterEnum["Q4"] = "Q4";
})(KpmrQuarterEnum || (exports.KpmrQuarterEnum = KpmrQuarterEnum = {}));
class KpmrSkorDto {
    Q1;
    Q2;
    Q3;
    Q4;
}
exports.KpmrSkorDto = KpmrSkorDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], KpmrSkorDto.prototype, "Q3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
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
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "strong", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "satisfactory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "fair", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "marginal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KpmrIndicatorDto.prototype, "unsatisfactory", void 0);
class CreateKpmrKonsentrasiOjkDto {
    year;
    quarter;
    isActive;
    createdBy;
    version;
    notes;
    summary;
    aspekList;
}
exports.CreateKpmrKonsentrasiOjkDto = CreateKpmrKonsentrasiOjkDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], CreateKpmrKonsentrasiOjkDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], CreateKpmrKonsentrasiOjkDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateKpmrKonsentrasiOjkDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrKonsentrasiOjkDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrKonsentrasiOjkDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrKonsentrasiOjkDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateKpmrKonsentrasiOjkDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateKpmrAspekKonsentrasiDto),
    __metadata("design:type", Array)
], CreateKpmrKonsentrasiOjkDto.prototype, "aspekList", void 0);
class CreateKpmrAspekKonsentrasiDto {
    nomor;
    judul;
    bobot;
    deskripsi;
    kpmrOjkId;
    orderIndex;
    pertanyaanList;
}
exports.CreateKpmrAspekKonsentrasiDto = CreateKpmrAspekKonsentrasiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrAspekKonsentrasiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKpmrAspekKonsentrasiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateKpmrAspekKonsentrasiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrAspekKonsentrasiDto.prototype, "deskripsi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKpmrAspekKonsentrasiDto.prototype, "kpmrOjkId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKpmrAspekKonsentrasiDto.prototype, "orderIndex", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateKpmrPertanyaanKonsentrasiDto),
    __metadata("design:type", Array)
], CreateKpmrAspekKonsentrasiDto.prototype, "pertanyaanList", void 0);
class CreateKpmrPertanyaanKonsentrasiDto {
    nomor;
    pertanyaan;
    skor;
    indicator;
    evidence;
    catatan;
    aspekId;
    orderIndex;
}
exports.CreateKpmrPertanyaanKonsentrasiDto = CreateKpmrPertanyaanKonsentrasiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "pertanyaan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrSkorDto),
    __metadata("design:type", KpmrSkorDto)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "skor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrIndicatorDto),
    __metadata("design:type", KpmrIndicatorDto)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "indicator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "evidence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "catatan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "aspekId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKpmrPertanyaanKonsentrasiDto.prototype, "orderIndex", void 0);
class UpdateKpmrKonsentrasiOjkDto {
    year;
    quarter;
    isActive;
    isLocked;
    lockedBy;
    lockedAt;
    notes;
    summary;
    updatedBy;
}
exports.UpdateKpmrKonsentrasiOjkDto = UpdateKpmrKonsentrasiOjkDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    __metadata("design:type", Number)
], UpdateKpmrKonsentrasiOjkDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], UpdateKpmrKonsentrasiOjkDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKpmrKonsentrasiOjkDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateKpmrKonsentrasiOjkDto.prototype, "isLocked", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrKonsentrasiOjkDto.prototype, "lockedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateKpmrKonsentrasiOjkDto.prototype, "lockedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrKonsentrasiOjkDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateKpmrKonsentrasiOjkDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrKonsentrasiOjkDto.prototype, "updatedBy", void 0);
class UpdateKpmrAspekKonsentrasiDto {
    nomor;
    judul;
    bobot;
    deskripsi;
    orderIndex;
    updatedBy;
    notes;
}
exports.UpdateKpmrAspekKonsentrasiDto = UpdateKpmrAspekKonsentrasiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekKonsentrasiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateKpmrAspekKonsentrasiDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateKpmrAspekKonsentrasiDto.prototype, "bobot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekKonsentrasiDto.prototype, "deskripsi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateKpmrAspekKonsentrasiDto.prototype, "orderIndex", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekKonsentrasiDto.prototype, "updatedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrAspekKonsentrasiDto.prototype, "notes", void 0);
class UpdateKpmrPertanyaanKonsentrasiDto {
    nomor;
    pertanyaan;
    skor;
    indicator;
    evidence;
    catatan;
    orderIndex;
}
exports.UpdateKpmrPertanyaanKonsentrasiDto = UpdateKpmrPertanyaanKonsentrasiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "nomor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "pertanyaan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrSkorDto),
    __metadata("design:type", KpmrSkorDto)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "skor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => KpmrIndicatorDto),
    __metadata("design:type", KpmrIndicatorDto)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "indicator", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "evidence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "catatan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateKpmrPertanyaanKonsentrasiDto.prototype, "orderIndex", void 0);
class UpdateSkorDto {
    quarter;
    skor;
    updatedBy;
}
exports.UpdateSkorDto = UpdateSkorDto;
__decorate([
    (0, class_validator_1.IsEnum)(['Q1', 'Q2', 'Q3', 'Q4'], {
        message: 'Quarter harus Q1, Q2, Q3, atau Q4',
    }),
    __metadata("design:type", String)
], UpdateSkorDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateSkorDto.prototype, "skor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSkorDto.prototype, "updatedBy", void 0);
class BulkUpdateItemDto {
    pertanyaanId;
    quarter;
    skor;
}
exports.BulkUpdateItemDto = BulkUpdateItemDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], BulkUpdateItemDto.prototype, "pertanyaanId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['Q1', 'Q2', 'Q3', 'Q4'], {
        message: 'Quarter harus Q1, Q2, Q3, atau Q4',
    }),
    __metadata("design:type", String)
], BulkUpdateItemDto.prototype, "quarter", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], BulkUpdateItemDto.prototype, "skor", void 0);
class BulkUpdateSkorDto {
    updates;
}
exports.BulkUpdateSkorDto = BulkUpdateSkorDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BulkUpdateItemDto),
    __metadata("design:type", Array)
], BulkUpdateSkorDto.prototype, "updates", void 0);
class ReorderAspekDto {
    aspekIds;
}
exports.ReorderAspekDto = ReorderAspekDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ReorderAspekDto.prototype, "aspekIds", void 0);
class ReorderPertanyaanDto {
    pertanyaanIds;
}
exports.ReorderPertanyaanDto = ReorderPertanyaanDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], ReorderPertanyaanDto.prototype, "pertanyaanIds", void 0);
class UpdateSummaryDto {
    totalScore;
    averageScore;
    rating;
    computedAt;
}
exports.UpdateSummaryDto = UpdateSummaryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSummaryDto.prototype, "totalScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSummaryDto.prototype, "averageScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSummaryDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateSummaryDto.prototype, "computedAt", void 0);
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
class FrontendAspekResponseDto {
    id;
    nomor;
    judul;
    bobot;
    deskripsi;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
    pertanyaanList;
}
exports.FrontendAspekResponseDto = FrontendAspekResponseDto;
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
    createdAt;
    updatedAt;
}
exports.FrontendKpmrResponseDto = FrontendKpmrResponseDto;
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
//# sourceMappingURL=konsentrasi-kpmr.dto.js.map