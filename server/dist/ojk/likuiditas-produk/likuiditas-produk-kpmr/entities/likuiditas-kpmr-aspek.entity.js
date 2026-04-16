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
exports.KpmrAspekLikuiditas = void 0;
const typeorm_1 = require("typeorm");
const likuiditas_produk_ojk_entity_1 = require("./likuiditas-produk-ojk.entity");
const likuiditas_kpmr_pertanyaan_entity_1 = require("./likuiditas-kpmr-pertanyaan.entity");
let KpmrAspekLikuiditas = class KpmrAspekLikuiditas {
    id;
    nomor;
    judul;
    bobot;
    deskripsi;
    kpmrOjkId;
    kpmrOjk;
    pertanyaanList;
    createdAt;
    updatedAt;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
};
exports.KpmrAspekLikuiditas = KpmrAspekLikuiditas;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrAspekLikuiditas.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrAspekLikuiditas.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KpmrAspekLikuiditas.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KpmrAspekLikuiditas.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrAspekLikuiditas.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kpmr_ojk_id' }),
    __metadata("design:type", Number)
], KpmrAspekLikuiditas.prototype, "kpmrOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => likuiditas_produk_ojk_entity_1.KpmrLikuiditasOjk, (kpmr) => kpmr.aspekList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kpmr_ojk_id' }),
    __metadata("design:type", likuiditas_produk_ojk_entity_1.KpmrLikuiditasOjk)
], KpmrAspekLikuiditas.prototype, "kpmrOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => likuiditas_kpmr_pertanyaan_entity_1.KpmrPertanyaanLikuiditas, (pertanyaan) => pertanyaan.aspek, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], KpmrAspekLikuiditas.prototype, "pertanyaanList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrAspekLikuiditas.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrAspekLikuiditas.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrAspekLikuiditas.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        name: 'average_score',
    }),
    __metadata("design:type", Number)
], KpmrAspekLikuiditas.prototype, "averageScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekLikuiditas.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrAspekLikuiditas.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrAspekLikuiditas.prototype, "notes", void 0);
exports.KpmrAspekLikuiditas = KpmrAspekLikuiditas = __decorate([
    (0, typeorm_1.Entity)('kpmr_aspek_likuiditas'),
    (0, typeorm_1.Index)(['kpmrOjkId', 'nomor']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'orderIndex']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'bobot']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'createdAt'])
], KpmrAspekLikuiditas);
//# sourceMappingURL=likuiditas-kpmr-aspek.entity.js.map