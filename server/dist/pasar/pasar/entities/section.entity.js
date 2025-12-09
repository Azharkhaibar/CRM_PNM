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
exports.SectionPasar = void 0;
const typeorm_1 = require("typeorm");
const indikator_entity_1 = require("./indikator.entity");
let SectionPasar = class SectionPasar {
    id;
    no_sec;
    nama_section;
    bobot_par;
    tahun;
    triwulan;
    indikators;
    total_weighted;
    created_at;
    updated_at;
};
exports.SectionPasar = SectionPasar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SectionPasar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], SectionPasar.prototype, "no_sec", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SectionPasar.prototype, "nama_section", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], SectionPasar.prototype, "bobot_par", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SectionPasar.prototype, "tahun", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] }),
    __metadata("design:type", String)
], SectionPasar.prototype, "triwulan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => indikator_entity_1.IndikatorPasar, (indikator) => indikator.section, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], SectionPasar.prototype, "indikators", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SectionPasar.prototype, "total_weighted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SectionPasar.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SectionPasar.prototype, "updated_at", void 0);
exports.SectionPasar = SectionPasar = __decorate([
    (0, typeorm_1.Entity)('sections_pasar')
], SectionPasar);
//# sourceMappingURL=section.entity.js.map