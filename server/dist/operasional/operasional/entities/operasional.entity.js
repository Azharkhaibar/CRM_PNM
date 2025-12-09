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
exports.Operational = exports.CalculationMode = exports.Quarter = void 0;
const typeorm_1 = require("typeorm");
const operasional_section_entity_1 = require("./operasional-section.entity");
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
})(CalculationMode || (exports.CalculationMode = CalculationMode = {}));
let Operational = class Operational {
    id;
    year;
    quarter;
    sectionId;
    section;
    subNo;
    indikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    mode;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
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
};
exports.Operational = Operational;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Operational.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Operational.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 2,
    }),
    __metadata("design:type", String)
], Operational.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'section_id' }),
    __metadata("design:type", Number)
], Operational.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => operasional_section_entity_1.SectionOperational, (section) => section.indikators, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'section_id' }),
    __metadata("design:type", operasional_section_entity_1.SectionOperational)
], Operational.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        name: 'sub_no',
    }),
    __metadata("design:type", String)
], Operational.prototype, "subNo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        name: 'indikator',
    }),
    __metadata("design:type", String)
], Operational.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'bobot_indikator',
    }),
    __metadata("design:type", Number)
], Operational.prototype, "bobotIndikator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'sumber_risiko',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "sumberRisiko", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'dampak',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'RASIO',
        name: 'mode',
    }),
    __metadata("design:type", String)
], Operational.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'pembilang_label',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "pembilangLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 20,
        scale: 4,
        nullable: true,
        name: 'pembilang_value',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "pembilangValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: true,
        name: 'penyebut_label',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "penyebutLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 20,
        scale: 4,
        nullable: true,
        name: 'penyebut_value',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "penyebutValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'formula',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_percent',
    }),
    __metadata("design:type", Boolean)
], Operational.prototype, "isPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 20,
        scale: 6,
        nullable: true,
        name: 'hasil',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 1,
        name: 'peringkat',
    }),
    __metadata("design:type", Number)
], Operational.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 4,
        name: 'weighted',
    }),
    __metadata("design:type", Number)
], Operational.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'keterangan',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Operational.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Operational.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_deleted',
    }),
    __metadata("design:type", Boolean)
], Operational.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        name: 'deleted_at',
    }),
    __metadata("design:type", Object)
], Operational.prototype, "deletedAt", void 0);
exports.Operational = Operational = __decorate([
    (0, typeorm_1.Entity)('indikators_operational'),
    (0, typeorm_1.Index)('IDX_OPERATIONAL_PERIOD', ['year', 'quarter']),
    (0, typeorm_1.Index)('IDX_OPERATIONAL_SECTION', ['sectionId'])
], Operational);
//# sourceMappingURL=operasional.entity.js.map