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
exports.KpmrAspekKepatuhan = void 0;
const typeorm_1 = require("typeorm");
const kepatuhan_kpmr_ojk_entity_1 = require("./kepatuhan-kpmr-ojk.entity");
const kepatuhan_kpmr_pertanyaan_entity_1 = require("./kepatuhan-kpmr-pertanyaan.entity");
let KpmrAspekKepatuhan = class KpmrAspekKepatuhan {
    id;
    nomor;
    judul;
    bobot;
    deskripsi;
    kpmrKepatuhanId;
    kpmrKepatuhan;
    pertanyaanList;
    createdAt;
    updatedAt;
    orderIndex;
    averageScore;
    rating;
    updatedBy;
    notes;
};
exports.KpmrAspekKepatuhan = KpmrAspekKepatuhan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrAspekKepatuhan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrAspekKepatuhan.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], KpmrAspekKepatuhan.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], KpmrAspekKepatuhan.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekKepatuhan.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kpmr_kepatuhan_id' }),
    __metadata("design:type", Number)
], KpmrAspekKepatuhan.prototype, "kpmrKepatuhanId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kepatuhan_kpmr_ojk_entity_1.KpmrKepatuhanOjk, (kpmr) => kpmr.aspekList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kpmr_kepatuhan_id' }),
    __metadata("design:type", kepatuhan_kpmr_ojk_entity_1.KpmrKepatuhanOjk)
], KpmrAspekKepatuhan.prototype, "kpmrKepatuhan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kepatuhan_kpmr_pertanyaan_entity_1.KpmrPertanyaanKepatuhan, (pertanyaan) => pertanyaan.aspek, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], KpmrAspekKepatuhan.prototype, "pertanyaanList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrAspekKepatuhan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrAspekKepatuhan.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrAspekKepatuhan.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        name: 'average_score',
    }),
    __metadata("design:type", Number)
], KpmrAspekKepatuhan.prototype, "averageScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekKepatuhan.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrAspekKepatuhan.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], KpmrAspekKepatuhan.prototype, "notes", void 0);
exports.KpmrAspekKepatuhan = KpmrAspekKepatuhan = __decorate([
    (0, typeorm_1.Entity)('kpmr_aspek_kepatuhan'),
    (0, typeorm_1.Index)(['kpmrKepatuhanId', 'nomor'], { unique: false }),
    (0, typeorm_1.Index)(['kpmrKepatuhanId', 'orderIndex'], { unique: false }),
    (0, typeorm_1.Index)(['kpmrKepatuhanId', 'bobot']),
    (0, typeorm_1.Index)(['kpmrKepatuhanId', 'createdAt'])
], KpmrAspekKepatuhan);
//# sourceMappingURL=kepatuhan-kpmr-aspek.entity.js.map