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
exports.PasarParameter = void 0;
const typeorm_1 = require("typeorm");
const pasar_produk_ojk_entity_1 = require("./pasar-produk-ojk.entity");
const pasar_produk_nilai_entity_1 = require("./pasar-produk-nilai.entity");
let PasarParameter = class PasarParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    pasarProdukOjkId;
    pasarProdukOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.PasarParameter = PasarParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PasarParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PasarParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], PasarParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], PasarParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PasarParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pasar_produk_ojk_id' }),
    __metadata("design:type", Number)
], PasarParameter.prototype, "pasarProdukOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pasar_produk_ojk_entity_1.PasarProdukOjk, (pasar) => pasar.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'pasar_produk_ojk_id' }),
    __metadata("design:type", pasar_produk_ojk_entity_1.PasarProdukOjk)
], PasarParameter.prototype, "pasarProdukOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pasar_produk_nilai_entity_1.PasarNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], PasarParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PasarParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PasarParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], PasarParameter.prototype, "orderIndex", void 0);
exports.PasarParameter = PasarParameter = __decorate([
    (0, typeorm_1.Entity)('pasar_parameters'),
    (0, typeorm_1.Index)(['pasarProdukOjkId', 'nomor'], { unique: false })
], PasarParameter);
//# sourceMappingURL=pasar-produk-parameter.entity.js.map