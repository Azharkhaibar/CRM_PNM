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
exports.CreateInvestasiSectionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const new_investasi_entity_1 = require("../entities/new-investasi.entity");
class CreateInvestasiSectionDto {
    no;
    parameter;
    bobotSection = 100;
    description;
    sortOrder = 0;
    year;
    quarter;
    isActive = true;
}
exports.CreateInvestasiSectionDto = CreateInvestasiSectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '6.1',
        description: 'Nomor section (unik dengan parameter + periode)',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor section tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nomor section harus berupa string' }),
    (0, class_validator_1.Length)(1, 50, { message: 'Nomor section maksimal 50 karakter' }),
    __metadata("design:type", String)
], CreateInvestasiSectionDto.prototype, "no", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Pencapaian Rencana Bisnis Perusahaan',
        description: 'Nama section',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Parameter tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Parameter harus berupa string' }),
    (0, class_validator_1.Length)(1, 500, { message: 'Parameter maksimal 500 karakter' }),
    __metadata("design:type", String)
], CreateInvestasiSectionDto.prototype, "parameter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Bobot section dalam persen',
        required: false,
        default: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Bobot section harus berupa angka' }),
    (0, class_validator_1.Min)(0, { message: 'Bobot section minimal 0' }),
    (0, class_validator_1.Max)(100, { message: 'Bobot section maksimal 100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiSectionDto.prototype, "bobotSection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Deskripsi tambahan section' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Deskripsi harus berupa string' }),
    __metadata("design:type", String)
], CreateInvestasiSectionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: false,
        description: 'Urutan tampilan section',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Sort order harus berupa angka' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiSectionDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024, description: 'Tahun data section' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tahun tidak boleh kosong' }),
    (0, class_validator_1.IsInt)({ message: 'Tahun harus berupa angka bulat' }),
    (0, class_validator_1.Min)(2000, { message: 'Tahun minimal 2000' }),
    (0, class_validator_1.Max)(2100, { message: 'Tahun maksimal 2100' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInvestasiSectionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q1', enum: new_investasi_entity_1.Quarter, description: 'Triwulan' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Quarter tidak boleh kosong' }),
    (0, class_validator_1.IsEnum)(new_investasi_entity_1.Quarter, { message: 'Quarter harus Q1, Q2, Q3, atau Q4' }),
    __metadata("design:type", String)
], CreateInvestasiSectionDto.prototype, "quarter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        required: false,
        description: 'Status aktif section',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Status aktif harus berupa boolean' }),
    __metadata("design:type", Boolean)
], CreateInvestasiSectionDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-investasi-section.dto.js.map