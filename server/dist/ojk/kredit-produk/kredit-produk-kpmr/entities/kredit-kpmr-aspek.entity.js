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
exports.KpmrAspekKredit = void 0;
const typeorm_1 = require("typeorm");
const kredit_produk_kpmr_entity_1 = require("./kredit-produk-kpmr.entity");
const kredit_kpmr_pertanyaan_entity_1 = require("./kredit-kpmr-pertanyaan.entity");
let KpmrAspekKredit = class KpmrAspekKredit {
    id;
    nomor;
    judul;
    bobot;
    deskripsi;
    kpmrKreditId;
    kpmrKredit;
    pertanyaanList;
    createdAt;
    updatedAt;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
};
exports.KpmrAspekKredit = KpmrAspekKredit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrAspekKredit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrAspekKredit.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], KpmrAspekKredit.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], KpmrAspekKredit.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekKredit.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kpmr_kredit_id' }),
    __metadata("design:type", Number)
], KpmrAspekKredit.prototype, "kpmrKreditId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kredit_produk_kpmr_entity_1.KpmrKreditOjk, (kpmr) => kpmr.aspekList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kpmr_kredit_id' }),
    __metadata("design:type", kredit_produk_kpmr_entity_1.KpmrKreditOjk)
], KpmrAspekKredit.prototype, "kpmrKredit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kredit_kpmr_pertanyaan_entity_1.KpmrPertanyaanKredit, (pertanyaan) => pertanyaan.aspek, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], KpmrAspekKredit.prototype, "pertanyaanList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrAspekKredit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrAspekKredit.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrAspekKredit.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        name: 'average_score',
    }),
    __metadata("design:type", Number)
], KpmrAspekKredit.prototype, "averageScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekKredit.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrAspekKredit.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], KpmrAspekKredit.prototype, "notes", void 0);
exports.KpmrAspekKredit = KpmrAspekKredit = __decorate([
    (0, typeorm_1.Entity)('kpmr_aspek_kredit'),
    (0, typeorm_1.Index)(['kpmrKreditId', 'nomor'], { unique: false }),
    (0, typeorm_1.Index)(['kpmrKreditId', 'orderIndex'], { unique: false }),
    (0, typeorm_1.Index)(['kpmrKreditId', 'bobot']),
    (0, typeorm_1.Index)(['kpmrKreditId', 'createdAt'])
], KpmrAspekKredit);
//# sourceMappingURL=kredit-kpmr-aspek.entity.js.map