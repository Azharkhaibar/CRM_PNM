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
exports.Likuiditas = exports.CalculationMode = exports.Quarter = void 0;
const typeorm_1 = require("typeorm");
const section_likuiditas_entity_1 = require("./section-likuiditas.entity");
var Quarter;
(function (Quarter) {
    Quarter["Q1"] = "Q1";
    Quarter["Q2"] = "Q2";
    Quarter["Q3"] = "Q3";
    Quarter["Q4"] = "Q4";
})(Quarter || (exports.Quarter = Quarter = {}));
var CalculationMode;
(function (CalculationMode) {
    CalculationMode["RASIO"] = "RASIO";
    CalculationMode["NILAI_TUNGGAL"] = "NILAI_TUNGGAL";
    CalculationMode["TEKS"] = "TEKS";
})(CalculationMode || (exports.CalculationMode = CalculationMode = {}));
let Likuiditas = class Likuiditas {
    id;
    year;
    quarter;
    sectionId;
    section;
    subNo;
    namaIndikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
    mode;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    formula;
    isPercent;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
    createdAt;
    updatedAt;
    isDeleted;
    deletedAt;
};
exports.Likuiditas = Likuiditas;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Likuiditas.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Likuiditas.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 2,
    }),
    __metadata("design:type", String)
], Likuiditas.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section_id' }),
    __metadata("design:type", Number)
], Likuiditas.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => section_likuiditas_entity_1.SectionLikuiditas, (section) => section.indikators, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'section_id' }),
    __metadata("design:type", section_likuiditas_entity_1.SectionLikuiditas)
], Likuiditas.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        name: 'sub_no',
    }),
    __metadata("design:type", String)
], Likuiditas.prototype, "subNo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        name: 'nama_indikator',
    }),
    __metadata("design:type", String)
], Likuiditas.prototype, "namaIndikator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'bobot_indikator',
    }),
    __metadata("design:type", Number)
], Likuiditas.prototype, "bobotIndikator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'sumber_risiko',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "sumberRisiko", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'dampak',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'low',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'low_to_moderate',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "lowToModerate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'moderate',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'moderate_to_high',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "moderateToHigh", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'high',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'RASIO',
        name: 'mode',
    }),
    __metadata("design:type", String)
], Likuiditas.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'pembilang_label',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "pembilangLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'pembilang_value',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "pembilangValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'penyebut_label',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "penyebutLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'penyebut_value',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "penyebutValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'formula',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_percent',
    }),
    __metadata("design:type", Boolean)
], Likuiditas.prototype, "isPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'hasil',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        nullable: true,
        name: 'hasil_text',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "hasilText", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 1,
        name: 'peringkat',
    }),
    __metadata("design:type", Number)
], Likuiditas.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 4,
        name: 'weighted',
    }),
    __metadata("design:type", Number)
], Likuiditas.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'keterangan',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Likuiditas.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Likuiditas.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_deleted',
    }),
    __metadata("design:type", Boolean)
], Likuiditas.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        name: 'deleted_at',
    }),
    __metadata("design:type", Object)
], Likuiditas.prototype, "deletedAt", void 0);
exports.Likuiditas = Likuiditas = __decorate([
    (0, typeorm_1.Entity)('indikators_likuiditas'),
    (0, typeorm_1.Index)('IDX_LIKUIDITAS_PERIOD', ['year', 'quarter']),
    (0, typeorm_1.Index)('IDX_LIKUIDITAS_SECTION', ['sectionId'])
], Likuiditas);
//# sourceMappingURL=likuiditas.entity.js.map