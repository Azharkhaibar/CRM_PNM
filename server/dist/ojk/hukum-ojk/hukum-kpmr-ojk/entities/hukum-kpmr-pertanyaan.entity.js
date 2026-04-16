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
exports.KpmrPertanyaanHukum = void 0;
const typeorm_1 = require("typeorm");
const hukum_kpmr_aspek_entity_1 = require("./hukum-kpmr-aspek.entity");
let KpmrPertanyaanHukum = class KpmrPertanyaanHukum {
    id;
    nomor;
    pertanyaan;
    skor = {};
    indicator;
    evidence;
    catatan;
    aspekId;
    aspek;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.KpmrPertanyaanHukum = KpmrPertanyaanHukum;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrPertanyaanHukum.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanHukum.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], KpmrPertanyaanHukum.prototype, "pertanyaan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrPertanyaanHukum.prototype, "skor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrPertanyaanHukum.prototype, "indicator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanHukum.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanHukum.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aspek_id' }),
    __metadata("design:type", Number)
], KpmrPertanyaanHukum.prototype, "aspekId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hukum_kpmr_aspek_entity_1.KpmrAspekHukum, (aspek) => aspek.pertanyaanList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'aspek_id' }),
    __metadata("design:type", hukum_kpmr_aspek_entity_1.KpmrAspekHukum)
], KpmrPertanyaanHukum.prototype, "aspek", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrPertanyaanHukum.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrPertanyaanHukum.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrPertanyaanHukum.prototype, "orderIndex", void 0);
exports.KpmrPertanyaanHukum = KpmrPertanyaanHukum = __decorate([
    (0, typeorm_1.Entity)('kpmr_pertanyaan_hukum'),
    (0, typeorm_1.Index)(['aspekId', 'nomor'], { unique: false }),
    (0, typeorm_1.Index)(['aspekId', 'orderIndex'], { unique: false }),
    (0, typeorm_1.Index)(['aspekId', 'createdAt'])
], KpmrPertanyaanHukum);
//# sourceMappingURL=hukum-kpmr-pertanyaan.entity.js.map