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
exports.KonsentrasiParameter = void 0;
const typeorm_1 = require("typeorm");
const konsentrasi_produk_ojk_entity_1 = require("./konsentrasi-produk-ojk.entity");
const konsentrasi_produk_nilai_entity_1 = require("./konsentrasi-produk-nilai.entity");
let KonsentrasiParameter = class KonsentrasiParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    konsentrasiProdukOjkId;
    konsentrasiProdukOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.KonsentrasiParameter = KonsentrasiParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KonsentrasiParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KonsentrasiParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], KonsentrasiParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], KonsentrasiParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KonsentrasiParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'konsentrasi_produk_ojk_id' }),
    __metadata("design:type", Number)
], KonsentrasiParameter.prototype, "konsentrasiProdukOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => konsentrasi_produk_ojk_entity_1.KonsentrasiProdukOjk, (kons) => kons.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'konsentrasi_produk_ojk_id' }),
    __metadata("design:type", konsentrasi_produk_ojk_entity_1.KonsentrasiProdukOjk)
], KonsentrasiParameter.prototype, "konsentrasiProdukOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => konsentrasi_produk_nilai_entity_1.KonsentrasiNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], KonsentrasiParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KonsentrasiParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KonsentrasiParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KonsentrasiParameter.prototype, "orderIndex", void 0);
exports.KonsentrasiParameter = KonsentrasiParameter = __decorate([
    (0, typeorm_1.Entity)('konsentrasi_parameters'),
    (0, typeorm_1.Index)(['konsentrasiProdukOjkId', 'nomor'], { unique: false })
], KonsentrasiParameter);
//# sourceMappingURL=konsentrasi-produk-paramter.entity.js.map