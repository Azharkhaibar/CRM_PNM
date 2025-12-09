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
exports.Investasi = exports.Quarter = exports.CalculationMode = void 0;
const typeorm_1 = require("typeorm");
const new_investasi_section_entity_1 = require("./new-investasi-section.entity");
var CalculationMode;
(function (CalculationMode) {
    CalculationMode["RASIO"] = "RASIO";
    CalculationMode["NILAI_TUNGGAL"] = "NILAI_TUNGGAL";
})(CalculationMode || (exports.CalculationMode = CalculationMode = {}));
var Quarter;
(function (Quarter) {
    Quarter["Q1"] = "Q1";
    Quarter["Q2"] = "Q2";
    Quarter["Q3"] = "Q3";
    Quarter["Q4"] = "Q4";
})(Quarter || (exports.Quarter = Quarter = {}));
let Investasi = class Investasi {
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
    numeratorLabel;
    numeratorValue;
    denominatorLabel;
    denominatorValue;
    formula;
    isPercent;
    hasil;
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
exports.Investasi = Investasi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Investasi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Investasi.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Quarter }),
    __metadata("design:type", String)
], Investasi.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Investasi.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => new_investasi_section_entity_1.InvestasiSection, (section) => section.investasi, {
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sectionId' }),
    __metadata("design:type", new_investasi_section_entity_1.InvestasiSection)
], Investasi.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Investasi.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Investasi.prototype, "sectionLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Investasi.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'no_indikator' }),
    __metadata("design:type", String)
], Investasi.prototype, "subNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Investasi.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'bobot_indikator' }),
    __metadata("design:type", Number)
], Investasi.prototype, "bobotIndikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'sumber_resiko' }),
    __metadata("design:type", String)
], Investasi.prototype, "sumberRisiko", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Investasi.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'x ≤ 1%' }),
    __metadata("design:type", String)
], Investasi.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        default: '1% < x ≤ 2%',
        name: 'low_to_moderate',
    }),
    __metadata("design:type", String)
], Investasi.prototype, "lowToModerate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: '2% < x ≤ 3%' }),
    __metadata("design:type", String)
], Investasi.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        default: '3% < x ≤ 4%',
        name: 'moderate_to_high',
    }),
    __metadata("design:type", String)
], Investasi.prototype, "moderateToHigh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'x > 4%' }),
    __metadata("design:type", String)
], Investasi.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CalculationMode,
        default: CalculationMode.RASIO,
    }),
    __metadata("design:type", String)
], Investasi.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'nama_pembilang',
    }),
    __metadata("design:type", String)
], Investasi.prototype, "numeratorLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
        name: 'total_pembilang',
    }),
    __metadata("design:type", Number)
], Investasi.prototype, "numeratorValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'nama_penyebut' }),
    __metadata("design:type", String)
], Investasi.prototype, "denominatorLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, name: 'total_penyebut' }),
    __metadata("design:type", Number)
], Investasi.prototype, "denominatorValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Investasi.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Investasi.prototype, "isPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], Investasi.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Investasi.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], Investasi.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Investasi.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Investasi.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Investasi.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Investasi.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Investasi.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Investasi.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Investasi.prototype, "updatedBy", void 0);
exports.Investasi = Investasi = __decorate([
    (0, typeorm_1.Entity)('investasi'),
    (0, typeorm_1.Index)('IDX_INVESTASI_PERIOD', ['year', 'quarter']),
    (0, typeorm_1.Index)('IDX_INVESTASI_SECTION', ['sectionId'])
], Investasi);
//# sourceMappingURL=new-investasi.entity.js.map