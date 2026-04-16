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
exports.Pasar = exports.Quarter = exports.CalculationMode = void 0;
const typeorm_1 = require("typeorm");
const pasar_section_entity_1 = require("./pasar-section.entity");
var CalculationMode;
(function (CalculationMode) {
    CalculationMode["RASIO"] = "RASIO";
    CalculationMode["NILAI_TUNGGAL"] = "NILAI_TUNGGAL";
    CalculationMode["TEKS"] = "TEKS";
})(CalculationMode || (exports.CalculationMode = CalculationMode = {}));
var Quarter;
(function (Quarter) {
    Quarter["Q1"] = "Q1";
    Quarter["Q2"] = "Q2";
    Quarter["Q3"] = "Q3";
    Quarter["Q4"] = "Q4";
})(Quarter || (exports.Quarter = Quarter = {}));
let Pasar = class Pasar {
    id;
    year;
    quarter;
    sectionId;
    section;
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
    mode;
    formula;
    isPercent;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
    isValidated;
    validatedAt;
    validatedBy;
    createdAt;
    updatedAt;
    isDeleted;
    deletedAt;
    createdBy;
    updatedBy;
    deletedBy;
    version;
    revisionNotes;
};
exports.Pasar = Pasar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pasar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Pasar.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Quarter }),
    __metadata("design:type", String)
], Pasar.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section_id' }),
    __metadata("design:type", Number)
], Pasar.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pasar_section_entity_1.PasarSection, (section) => section.pasarIndicators, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'section_id' }),
    __metadata("design:type", pasar_section_entity_1.PasarSection)
], Pasar.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Pasar.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        name: 'section_label',
    }),
    __metadata("design:type", String)
], Pasar.prototype, "sectionLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'bobot_section',
    }),
    __metadata("design:type", Number)
], Pasar.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        name: 'sub_no',
    }),
    __metadata("design:type", String)
], Pasar.prototype, "subNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000 }),
    __metadata("design:type", String)
], Pasar.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'bobot_indikator',
    }),
    __metadata("design:type", Number)
], Pasar.prototype, "bobotIndikator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'sumber_risiko',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "sumberRisiko", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Pasar.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
        name: 'low_to_moderate',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "lowToModerate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
        name: 'moderate_to_high',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "moderateToHigh", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CalculationMode,
        default: CalculationMode.RASIO,
    }),
    __metadata("design:type", String)
], Pasar.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Pasar.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_percent',
    }),
    __metadata("design:type", Boolean)
], Pasar.prototype, "isPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'pembilang_label',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "pembilangLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'pembilang_value',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "pembilangValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'penyebut_label',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "penyebutLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'penyebut_value',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "penyebutValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 6,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 1000,
        nullable: true,
        name: 'hasil_text',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "hasilText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Pasar.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 4,
    }),
    __metadata("design:type", Number)
], Pasar.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Pasar.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_validated',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Pasar.prototype, "isValidated", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        name: 'validated_at',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "validatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'validated_by',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "validatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Pasar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Pasar.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Pasar.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        name: 'deleted_at',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'created_by',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'updated_by',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'deleted_by',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "deletedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 1,
    }),
    __metadata("design:type", Number)
], Pasar.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'revision_notes',
    }),
    __metadata("design:type", Object)
], Pasar.prototype, "revisionNotes", void 0);
exports.Pasar = Pasar = __decorate([
    (0, typeorm_1.Entity)('indikators_pasar_holding'),
    (0, typeorm_1.Unique)('UQ_PASAR_PERIOD_SUBNO', ['year', 'quarter', 'subNo', 'sectionId']),
    (0, typeorm_1.Index)('IDX_PASAR_PERIOD', ['year', 'quarter']),
    (0, typeorm_1.Index)('IDX_PASAR_SECTION', ['sectionId'])
], Pasar);
//# sourceMappingURL=pasar.entity.js.map