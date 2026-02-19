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
exports.KpmrPasarOjkResponseDto = exports.KpmrAspekPasarResponseDto = exports.KpmrPertanyaanPasarResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class KpmrPertanyaanPasarResponseDto {
    id;
    nomor;
    pertanyaan;
    skor;
    indicator;
    evidence;
    catatan;
    aspekId;
    orderIndex;
    createdAt;
    updatedAt;
}
exports.KpmrPertanyaanPasarResponseDto = KpmrPertanyaanPasarResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID Pertanyaan' }),
    __metadata("design:type", Number)
], KpmrPertanyaanPasarResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor pertanyaan' }),
    __metadata("design:type", String)
], KpmrPertanyaanPasarResponseDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Teks pertanyaan' }),
    __metadata("design:type", String)
], KpmrPertanyaanPasarResponseDto.prototype, "pertanyaan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor per quarter' }),
    __metadata("design:type", Object)
], KpmrPertanyaanPasarResponseDto.prototype, "skor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Indicator/description level' }),
    __metadata("design:type", Object)
], KpmrPertanyaanPasarResponseDto.prototype, "indicator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Evidence/bukti' }),
    __metadata("design:type", String)
], KpmrPertanyaanPasarResponseDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan' }),
    __metadata("design:type", String)
], KpmrPertanyaanPasarResponseDto.prototype, "catatan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID Aspek' }),
    __metadata("design:type", Number)
], KpmrPertanyaanPasarResponseDto.prototype, "aspekId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Index urutan' }),
    __metadata("design:type", Number)
], KpmrPertanyaanPasarResponseDto.prototype, "orderIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dibuat pada' }),
    __metadata("design:type", Date)
], KpmrPertanyaanPasarResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diupdate pada' }),
    __metadata("design:type", Date)
], KpmrPertanyaanPasarResponseDto.prototype, "updatedAt", void 0);
class KpmrAspekPasarResponseDto {
    id;
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
    createdAt;
    updatedAt;
    pertanyaanList;
}
exports.KpmrAspekPasarResponseDto = KpmrAspekPasarResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID Aspek' }),
    __metadata("design:type", Number)
], KpmrAspekPasarResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nomor aspek' }),
    __metadata("design:type", String)
], KpmrAspekPasarResponseDto.prototype, "nomor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Judul aspek' }),
    __metadata("design:type", String)
], KpmrAspekPasarResponseDto.prototype, "judul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bobot aspek' }),
    __metadata("design:type", Number)
], KpmrAspekPasarResponseDto.prototype, "bobot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deskripsi aspek' }),
    __metadata("design:type", String)
], KpmrAspekPasarResponseDto.prototype, "deskripsi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID KPMR OJK' }),
    __metadata("design:type", Number)
], KpmrAspekPasarResponseDto.prototype, "kpmrOjkId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Index urutan' }),
    __metadata("design:type", Number)
], KpmrAspekPasarResponseDto.prototype, "orderIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Skor rata-rata' }),
    __metadata("design:type", Number)
], KpmrAspekPasarResponseDto.prototype, "averageScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rating' }),
    __metadata("design:type", String)
], KpmrAspekPasarResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diupdate oleh' }),
    __metadata("design:type", String)
], KpmrAspekPasarResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan' }),
    __metadata("design:type", String)
], KpmrAspekPasarResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dibuat pada' }),
    __metadata("design:type", Date)
], KpmrAspekPasarResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diupdate pada' }),
    __metadata("design:type", Date)
], KpmrAspekPasarResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => [KpmrPertanyaanPasarResponseDto],
        description: 'Daftar pertanyaan',
    }),
    __metadata("design:type", Array)
], KpmrAspekPasarResponseDto.prototype, "pertanyaanList", void 0);
class KpmrPasarOjkResponseDto {
    id;
    year;
    quarter;
    isActive;
    summary;
    createdAt;
    updatedAt;
    createdBy;
    updatedBy;
    version;
    isLocked;
    lockedAt;
    lockedBy;
    notes;
    aspekList;
}
exports.KpmrPasarOjkResponseDto = KpmrPasarOjkResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID KPMR' }),
    __metadata("design:type", Number)
], KpmrPasarOjkResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tahun' }),
    __metadata("design:type", Number)
], KpmrPasarOjkResponseDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quarter' }),
    __metadata("design:type", Number)
], KpmrPasarOjkResponseDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status aktif' }),
    __metadata("design:type", Boolean)
], KpmrPasarOjkResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Summary data' }),
    __metadata("design:type", Object)
], KpmrPasarOjkResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dibuat pada' }),
    __metadata("design:type", Date)
], KpmrPasarOjkResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diupdate pada' }),
    __metadata("design:type", Date)
], KpmrPasarOjkResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dibuat oleh' }),
    __metadata("design:type", String)
], KpmrPasarOjkResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diupdate oleh' }),
    __metadata("design:type", String)
], KpmrPasarOjkResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Versi' }),
    __metadata("design:type", String)
], KpmrPasarOjkResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status terkunci' }),
    __metadata("design:type", Boolean)
], KpmrPasarOjkResponseDto.prototype, "isLocked", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tanggal terkunci' }),
    __metadata("design:type", Date)
], KpmrPasarOjkResponseDto.prototype, "lockedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dikunci oleh' }),
    __metadata("design:type", String)
], KpmrPasarOjkResponseDto.prototype, "lockedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Catatan' }),
    __metadata("design:type", String)
], KpmrPasarOjkResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => [KpmrAspekPasarResponseDto],
        description: 'Daftar aspek',
    }),
    __metadata("design:type", Array)
], KpmrPasarOjkResponseDto.prototype, "aspekList", void 0);
//# sourceMappingURL=pasar-produk-response-kpmr.dto.js.map