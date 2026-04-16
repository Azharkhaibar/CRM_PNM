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
exports.UpdateKPMRScoreDto = exports.CreateKPMRScoreDto = exports.UpdateKPMRDefinitionDto = exports.CreateKPMRDefinitionDto = exports.UpdateKPMRQuestionDto = exports.CreateKPMRQuestionDto = exports.UpdateKPMRAspectDto = exports.CreateKPMRAspectDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateKPMRAspectDto {
    year;
    aspekNo;
    aspekTitle;
    aspekBobot;
}
exports.CreateKPMRAspectDto = CreateKPMRAspectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRAspectDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aspek 1', description: 'Nomor aspek' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor aspek maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMRAspectDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tata Kelola Risiko', description: 'Judul aspek' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Judul aspek maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateKPMRAspectDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Bobot aspek dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot aspek tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot aspek harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot aspek minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot aspek maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRAspectDto.prototype, "aspekBobot", void 0);
class UpdateKPMRAspectDto {
    aspekNo;
    aspekTitle;
    aspekBobot;
}
exports.UpdateKPMRAspectDto = UpdateKPMRAspectDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aspek 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMRAspectDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tata Kelola Risiko' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateKPMRAspectDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMRAspectDto.prototype, "aspekBobot", void 0);
class CreateKPMRQuestionDto {
    year;
    aspekNo;
    sectionNo;
    sectionTitle;
}
exports.CreateKPMRQuestionDto = CreateKPMRQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRQuestionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Aspek 1',
        description: 'Nomor aspek yang memiliki pertanyaan ini',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor aspek maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMRQuestionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Nomor section/pertanyaan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMRQuestionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
        description: 'Teks pertanyaan section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul pertanyaan tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul pertanyaan harus berupa string' }),
    __metadata("design:type", String)
], CreateKPMRQuestionDto.prototype, "sectionTitle", void 0);
class UpdateKPMRQuestionDto {
    aspekNo;
    sectionNo;
    sectionTitle;
}
exports.UpdateKPMRQuestionDto = UpdateKPMRQuestionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aspek 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMRQuestionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMRQuestionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRQuestionDto.prototype, "sectionTitle", void 0);
class CreateKPMRDefinitionDto {
    year;
    aspekNo;
    aspekTitle;
    aspekBobot;
    sectionNo;
    sectionTitle;
    level1;
    level2;
    level3;
    level4;
    level5;
    evidence;
}
exports.CreateKPMRDefinitionDto = CreateKPMRDefinitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRDefinitionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aspek 1', description: 'Nomor aspek' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor aspek maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tata Kelola Risiko', description: 'Judul aspek' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Judul aspek maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Bobot aspek dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot aspek tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot aspek harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot aspek minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot aspek maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRDefinitionDto.prototype, "aspekBobot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Nomor section/pertanyaan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
        description: 'Teks pertanyaan section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul section harus berupa string' }),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "sectionTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 1 (Strong)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "level1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 2 (Satisfactory)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "level2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 3 (Fair)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "level3", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 4 (Marginal)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "level4", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 5 (Unsatisfactory)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "level5", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dokumen pendukung, kebijakan, dll' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMRDefinitionDto.prototype, "evidence", void 0);
class UpdateKPMRDefinitionDto {
    year;
    aspekNo;
    aspekTitle;
    aspekBobot;
    sectionNo;
    sectionTitle;
    level1;
    level2;
    level3;
    level4;
    level5;
    evidence;
}
exports.UpdateKPMRDefinitionDto = UpdateKPMRDefinitionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMRDefinitionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aspek 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tata Kelola Risiko' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMRDefinitionDto.prototype, "aspekBobot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "sectionTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "level1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "level2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "level3", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "level4", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "level5", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRDefinitionDto.prototype, "evidence", void 0);
class CreateKPMRScoreDto {
    definitionId;
    year;
    quarter;
    sectionSkor;
}
exports.CreateKPMRScoreDto = CreateKPMRScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID definisi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Definition ID tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Definition ID harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRScoreDto.prototype, "definitionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRScoreDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q1', description: 'Triwulan (Q1, Q2, Q3, Q4)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quarter tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Quarter harus berupa string' }),
    __metadata("design:type", String)
], CreateKPMRScoreDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 85,
        description: 'Skor untuk triwulan ini (0-100)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Section skor harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Skor minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Skor maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMRScoreDto.prototype, "sectionSkor", void 0);
class UpdateKPMRScoreDto {
    definitionId;
    year;
    quarter;
    sectionSkor;
}
exports.UpdateKPMRScoreDto = UpdateKPMRScoreDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMRScoreDto.prototype, "definitionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMRScoreDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Q1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMRScoreDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 85 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMRScoreDto.prototype, "sectionSkor", void 0);
//# sourceMappingURL=kpmr-investasi.dto.js.map