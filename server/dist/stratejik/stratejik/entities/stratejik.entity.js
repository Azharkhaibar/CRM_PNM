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
exports.Stratejik = exports.Quarter = exports.CalculationMode = void 0;
const typeorm_1 = require("typeorm");
const stratejik_section_entity_1 = require("./stratejik-section.entity");
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
let Stratejik = class Stratejik {
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
    createdBy;
    updatedBy;
};
exports.Stratejik = Stratejik;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stratejik.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Stratejik.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Quarter }),
    __metadata("design:type", String)
], Stratejik.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Stratejik.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stratejik_section_entity_1.StratejikSection, (section) => section.stratejik, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sectionId' }),
    __metadata("design:type", stratejik_section_entity_1.StratejikSection)
], Stratejik.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Stratejik.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Stratejik.prototype, "sectionLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Stratejik.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'no_indikator' }),
    __metadata("design:type", String)
], Stratejik.prototype, "subNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Stratejik.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'bobot_indikator' }),
    __metadata("design:type", Number)
], Stratejik.prototype, "bobotIndikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'sumber_resiko' }),
    __metadata("design:type", Object)
], Stratejik.prototype, "sumberRisiko", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'low_to_moderate',
    }),
    __metadata("design:type", Object)
], Stratejik.prototype, "lowToModerate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'moderate_to_high',
    }),
    __metadata("design:type", Object)
], Stratejik.prototype, "moderateToHigh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CalculationMode,
        default: CalculationMode.RASIO,
    }),
    __metadata("design:type", String)
], Stratejik.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'nama_pembilang',
    }),
    __metadata("design:type", Object)
], Stratejik.prototype, "pembilangLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'total_pembilang',
    }),
    __metadata("design:type", Object)
], Stratejik.prototype, "pembilangValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'nama_penyebut',
    }),
    __metadata("design:type", Object)
], Stratejik.prototype, "penyebutLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'total_penyebut',
    }),
    __metadata("design:type", Object)
], Stratejik.prototype, "penyebutValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Stratejik.prototype, "isPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'hasil_text' }),
    __metadata("design:type", Object)
], Stratejik.prototype, "hasilText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Stratejik.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], Stratejik.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Stratejik.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Stratejik.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Stratejik.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Stratejik.prototype, "updatedBy", void 0);
exports.Stratejik = Stratejik = __decorate([
    (0, typeorm_1.Entity)('stratejik'),
    (0, typeorm_1.Index)('IDX_STRATEJIK_PERIOD', ['year', 'quarter']),
    (0, typeorm_1.Index)('IDX_STRATEJIK_SECTION', ['sectionId'])
], Stratejik);
//# sourceMappingURL=stratejik.entity.js.map