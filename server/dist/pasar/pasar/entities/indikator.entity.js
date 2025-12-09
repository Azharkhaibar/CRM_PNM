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
exports.IndikatorPasar = void 0;
const typeorm_1 = require("typeorm");
const section_entity_1 = require("./section.entity");
let IndikatorPasar = class IndikatorPasar {
    id;
    section;
    nama_indikator;
    bobot_indikator;
    pembilang_label;
    pembilang_value;
    penyebut_label;
    penyebut_value;
    sumber_risiko;
    dampak;
    low;
    low_to_moderate;
    moderate;
    moderate_to_high;
    high;
    hasil;
    peringkat;
    weighted;
    keterangan;
    mode;
    formula;
    is_percent;
    created_at;
    updated_at;
};
exports.IndikatorPasar = IndikatorPasar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IndikatorPasar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => section_entity_1.SectionPasar, (section) => section.indikators, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sectionId' }),
    __metadata("design:type", section_entity_1.SectionPasar)
], IndikatorPasar.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "nama_indikator", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], IndikatorPasar.prototype, "bobot_indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "pembilang_label", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "pembilang_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "penyebut_label", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "penyebut_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "sumber_risiko", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "low_to_moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "moderate_to_high", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], IndikatorPasar.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], IndikatorPasar.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['RASIO', 'NILAI_TUNGGAL'],
        default: 'RASIO',
    }),
    __metadata("design:type", String)
], IndikatorPasar.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], IndikatorPasar.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], IndikatorPasar.prototype, "is_percent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IndikatorPasar.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], IndikatorPasar.prototype, "updated_at", void 0);
exports.IndikatorPasar = IndikatorPasar = __decorate([
    (0, typeorm_1.Entity)('indikators_pasar')
], IndikatorPasar);
//# sourceMappingURL=indikator.entity.js.map