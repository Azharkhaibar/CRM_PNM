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
exports.KpmrAspekHukum = void 0;
const typeorm_1 = require("typeorm");
const hukum_kpmr_ojk_entity_1 = require("./hukum-kpmr-ojk.entity");
const hukum_kpmr_pertanyaan_entity_1 = require("./hukum-kpmr-pertanyaan.entity");
let KpmrAspekHukum = class KpmrAspekHukum {
    id;
    nomor;
    judul;
    bobot;
    deskripsi;
    kpmrId;
    kpmr;
    pertanyaanList;
    createdAt;
    updatedAt;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
};
exports.KpmrAspekHukum = KpmrAspekHukum;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrAspekHukum.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrAspekHukum.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KpmrAspekHukum.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KpmrAspekHukum.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrAspekHukum.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kpmr_id' }),
    __metadata("design:type", Number)
], KpmrAspekHukum.prototype, "kpmrId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hukum_kpmr_ojk_entity_1.KpmrHukum, (kpmr) => kpmr.aspekList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kpmr_id' }),
    __metadata("design:type", hukum_kpmr_ojk_entity_1.KpmrHukum)
], KpmrAspekHukum.prototype, "kpmr", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hukum_kpmr_pertanyaan_entity_1.KpmrPertanyaanHukum, (pertanyaan) => pertanyaan.aspek, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], KpmrAspekHukum.prototype, "pertanyaanList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrAspekHukum.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrAspekHukum.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrAspekHukum.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        name: 'average_score',
    }),
    __metadata("design:type", Number)
], KpmrAspekHukum.prototype, "averageScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekHukum.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrAspekHukum.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrAspekHukum.prototype, "notes", void 0);
exports.KpmrAspekHukum = KpmrAspekHukum = __decorate([
    (0, typeorm_1.Entity)('kpmr_aspek_hukum'),
    (0, typeorm_1.Index)(['kpmrId', 'nomor']),
    (0, typeorm_1.Index)(['kpmrId', 'orderIndex']),
    (0, typeorm_1.Index)(['kpmrId', 'bobot']),
    (0, typeorm_1.Index)(['kpmrId', 'createdAt'])
], KpmrAspekHukum);
//# sourceMappingURL=hukum-kpmr-aspek.entity.js.map