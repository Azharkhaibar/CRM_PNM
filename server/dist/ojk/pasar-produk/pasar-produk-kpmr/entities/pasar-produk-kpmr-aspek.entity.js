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
exports.KpmrAspekPasar = void 0;
const typeorm_1 = require("typeorm");
const pasar_produk_ojk_entity_1 = require("./pasar-produk-ojk.entity");
const pasar_produk_kpmr_pertanyaan_entity_1 = require("./pasar-produk-kpmr-pertanyaan.entity");
let KpmrAspekPasar = class KpmrAspekPasar {
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
exports.KpmrAspekPasar = KpmrAspekPasar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrAspekPasar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrAspekPasar.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], KpmrAspekPasar.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], KpmrAspekPasar.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekPasar.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kpmr_ojk_id' }),
    __metadata("design:type", Number)
], KpmrAspekPasar.prototype, "kpmrOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pasar_produk_ojk_entity_1.KpmrPasarOjk, (kpmr) => kpmr.aspekList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kpmr_ojk_id' }),
    __metadata("design:type", pasar_produk_ojk_entity_1.KpmrPasarOjk)
], KpmrAspekPasar.prototype, "kpmrOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pasar_produk_kpmr_pertanyaan_entity_1.KpmrPertanyaanPasar, (pertanyaan) => pertanyaan.aspek, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], KpmrAspekPasar.prototype, "pertanyaanList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrAspekPasar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrAspekPasar.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrAspekPasar.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        name: 'average_score',
    }),
    __metadata("design:type", Number)
], KpmrAspekPasar.prototype, "averageScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekPasar.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrAspekPasar.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], KpmrAspekPasar.prototype, "notes", void 0);
exports.KpmrAspekPasar = KpmrAspekPasar = __decorate([
    (0, typeorm_1.Entity)('kpmr_aspek_pasar'),
    (0, typeorm_1.Index)(['kpmrOjkId', 'nomor'], { unique: false }),
    (0, typeorm_1.Index)(['kpmrOjkId', 'orderIndex'], { unique: false }),
    (0, typeorm_1.Index)(['kpmrOjkId', 'bobot']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'createdAt'])
], KpmrAspekPasar);
//# sourceMappingURL=pasar-produk-kpmr-aspek.entity.js.map