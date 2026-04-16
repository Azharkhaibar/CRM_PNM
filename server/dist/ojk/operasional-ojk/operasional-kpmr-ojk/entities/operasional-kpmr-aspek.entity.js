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
exports.KpmrAspekOperasional = void 0;
const typeorm_1 = require("typeorm");
const operasional_kpmr_ojk_entity_1 = require("./operasional-kpmr-ojk.entity");
const operasional_kpmr_pertanyaan_entity_1 = require("./operasional-kpmr-pertanyaan.entity");
let KpmrAspekOperasional = class KpmrAspekOperasional {
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
exports.KpmrAspekOperasional = KpmrAspekOperasional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrAspekOperasional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrAspekOperasional.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KpmrAspekOperasional.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KpmrAspekOperasional.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrAspekOperasional.prototype, "deskripsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kpmr_ojk_id' }),
    __metadata("design:type", Number)
], KpmrAspekOperasional.prototype, "kpmrOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => operasional_kpmr_ojk_entity_1.KpmrOperasionalOjk, (kpmr) => kpmr.aspekList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kpmr_ojk_id' }),
    __metadata("design:type", operasional_kpmr_ojk_entity_1.KpmrOperasionalOjk)
], KpmrAspekOperasional.prototype, "kpmrOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => operasional_kpmr_pertanyaan_entity_1.KpmrPertanyaanOperasional, (pertanyaan) => pertanyaan.aspek, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], KpmrAspekOperasional.prototype, "pertanyaanList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrAspekOperasional.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrAspekOperasional.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrAspekOperasional.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        name: 'average_score',
    }),
    __metadata("design:type", Number)
], KpmrAspekOperasional.prototype, "averageScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], KpmrAspekOperasional.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrAspekOperasional.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrAspekOperasional.prototype, "notes", void 0);
exports.KpmrAspekOperasional = KpmrAspekOperasional = __decorate([
    (0, typeorm_1.Entity)('kpmr_aspek_operasional'),
    (0, typeorm_1.Index)(['kpmrOjkId', 'nomor']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'orderIndex']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'bobot']),
    (0, typeorm_1.Index)(['kpmrOjkId', 'createdAt'])
], KpmrAspekOperasional);
//# sourceMappingURL=operasional-kpmr-aspek.entity.js.map