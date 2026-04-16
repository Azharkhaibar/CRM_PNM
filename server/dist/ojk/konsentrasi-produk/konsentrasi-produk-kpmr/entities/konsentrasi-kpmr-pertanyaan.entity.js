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
exports.KpmrPertanyaanKonsentrasi = void 0;
const typeorm_1 = require("typeorm");
const konsentrasi_kpmr_aspek_entity_1 = require("./konsentrasi-kpmr-aspek.entity");
let KpmrPertanyaanKonsentrasi = class KpmrPertanyaanKonsentrasi {
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
exports.KpmrPertanyaanKonsentrasi = KpmrPertanyaanKonsentrasi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrPertanyaanKonsentrasi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanKonsentrasi.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], KpmrPertanyaanKonsentrasi.prototype, "pertanyaan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrPertanyaanKonsentrasi.prototype, "skor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrPertanyaanKonsentrasi.prototype, "indicator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanKonsentrasi.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanKonsentrasi.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aspek_id' }),
    __metadata("design:type", Number)
], KpmrPertanyaanKonsentrasi.prototype, "aspekId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => konsentrasi_kpmr_aspek_entity_1.KpmrAspekKonsentrasi, (aspek) => aspek.pertanyaanList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'aspek_id' }),
    __metadata("design:type", konsentrasi_kpmr_aspek_entity_1.KpmrAspekKonsentrasi)
], KpmrPertanyaanKonsentrasi.prototype, "aspek", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrPertanyaanKonsentrasi.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrPertanyaanKonsentrasi.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrPertanyaanKonsentrasi.prototype, "orderIndex", void 0);
exports.KpmrPertanyaanKonsentrasi = KpmrPertanyaanKonsentrasi = __decorate([
    (0, typeorm_1.Entity)('kpmr_pertanyaan_konsentrasi'),
    (0, typeorm_1.Index)(['aspekId', 'nomor'], { unique: false }),
    (0, typeorm_1.Index)(['aspekId', 'orderIndex'], { unique: false }),
    (0, typeorm_1.Index)(['aspekId', 'createdAt'])
], KpmrPertanyaanKonsentrasi);
//# sourceMappingURL=konsentrasi-kpmr-pertanyaan.entity.js.map