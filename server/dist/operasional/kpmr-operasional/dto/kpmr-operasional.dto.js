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
exports.UpdateKPMROperasionalScoreDto = exports.CreateKPMROperasionalScoreDto = exports.UpdateKPMROperasionalDefinitionDto = exports.CreateKPMROperasionalDefinitionDto = exports.UpdateKPMROperasionalQuestionDto = exports.CreateKPMROperasionalQuestionDto = exports.UpdateKPMROperasionalAspectDto = exports.CreateKPMROperasionalAspectDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateKPMROperasionalAspectDto {
    year;
    aspekNo;
    aspekTitle;
    aspekBobot;
}
exports.CreateKPMROperasionalAspectDto = CreateKPMROperasionalAspectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalAspectDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aspek 1', description: 'Nomor aspek' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor aspek maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalAspectDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Tata Kelola Risiko Operasional',
        description: 'Judul aspek',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Judul aspek maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalAspectDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Bobot aspek dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot aspek tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot aspek harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot aspek minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot aspek maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalAspectDto.prototype, "aspekBobot", void 0);
class UpdateKPMROperasionalAspectDto {
    aspekNo;
    aspekTitle;
    aspekBobot;
}
exports.UpdateKPMROperasionalAspectDto = UpdateKPMROperasionalAspectDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aspek 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMROperasionalAspectDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tata Kelola Risiko Operasional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateKPMROperasionalAspectDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMROperasionalAspectDto.prototype, "aspekBobot", void 0);
class CreateKPMROperasionalQuestionDto {
    year;
    aspekNo;
    sectionNo;
    sectionTitle;
}
exports.CreateKPMROperasionalQuestionDto = CreateKPMROperasionalQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalQuestionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Aspek 1',
        description: 'Nomor aspek yang memiliki pertanyaan ini',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor aspek maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalQuestionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Nomor section/pertanyaan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalQuestionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bagaimana perumusan tingkat risiko operasional yang akan diambil?',
        description: 'Teks pertanyaan section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul pertanyaan tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul pertanyaan harus berupa string' }),
    __metadata("design:type", String)
], CreateKPMROperasionalQuestionDto.prototype, "sectionTitle", void 0);
class UpdateKPMROperasionalQuestionDto {
    aspekNo;
    sectionNo;
    sectionTitle;
}
exports.UpdateKPMROperasionalQuestionDto = UpdateKPMROperasionalQuestionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aspek 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMROperasionalQuestionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMROperasionalQuestionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Bagaimana perumusan tingkat risiko operasional yang akan diambil?',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalQuestionDto.prototype, "sectionTitle", void 0);
class CreateKPMROperasionalDefinitionDto {
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
exports.CreateKPMROperasionalDefinitionDto = CreateKPMROperasionalDefinitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalDefinitionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aspek 1', description: 'Nomor aspek' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor aspek maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Tata Kelola Risiko Operasional',
        description: 'Judul aspek',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul aspek tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul aspek harus berupa string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Judul aspek maksimal 255 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Bobot aspek dalam persen' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bobot aspek tidak boleh kosong' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot aspek harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot aspek minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot aspek maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalDefinitionDto.prototype, "aspekBobot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Nomor section/pertanyaan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bagaimana perumusan tingkat risiko operasional yang akan diambil?',
        description: 'Teks pertanyaan section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Judul section harus berupa string' }),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "sectionTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 1 (Strong)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "level1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 2 (Satisfactory)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "level2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 3 (Fair)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "level3", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 4 (Marginal)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "level4", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi untuk level 5 (Unsatisfactory)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "level5", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dokumen pendukung, kebijakan, dll' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKPMROperasionalDefinitionDto.prototype, "evidence", void 0);
class UpdateKPMROperasionalDefinitionDto {
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
exports.UpdateKPMROperasionalDefinitionDto = UpdateKPMROperasionalDefinitionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMROperasionalDefinitionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Aspek 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "aspekNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tata Kelola Risiko Operasional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "aspekTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMROperasionalDefinitionDto.prototype, "aspekBobot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "sectionNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Bagaimana perumusan tingkat risiko operasional yang akan diambil?',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "sectionTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "level1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "level2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "level3", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "level4", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "level5", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalDefinitionDto.prototype, "evidence", void 0);
class CreateKPMROperasionalScoreDto {
    definitionId;
    year;
    quarter;
    sectionSkor;
}
exports.CreateKPMROperasionalScoreDto = CreateKPMROperasionalScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID definisi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Definition ID tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Definition ID harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalScoreDto.prototype, "definitionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateKPMROperasionalScoreDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q1', description: 'Triwulan (Q1, Q2, Q3, Q4)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quarter tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Quarter harus berupa string' }),
    __metadata("design:type", String)
], CreateKPMROperasionalScoreDto.prototype, "quarter", void 0);
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
], CreateKPMROperasionalScoreDto.prototype, "sectionSkor", void 0);
class UpdateKPMROperasionalScoreDto {
    definitionId;
    year;
    quarter;
    sectionSkor;
}
exports.UpdateKPMROperasionalScoreDto = UpdateKPMROperasionalScoreDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMROperasionalScoreDto.prototype, "definitionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2024 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMROperasionalScoreDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Q1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKPMROperasionalScoreDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 85 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateKPMROperasionalScoreDto.prototype, "sectionSkor", void 0);
//# sourceMappingURL=kpmr-operasional.dto.js.map