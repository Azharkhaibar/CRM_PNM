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
exports.KreditParameter = void 0;
const typeorm_1 = require("typeorm");
const kredit_produk_ojk_entity_1 = require("./kredit-produk-ojk.entity");
const kredit_produk_nilai_entity_1 = require("./kredit-produk-nilai.entity");
let KreditParameter = class KreditParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    kreditProdukOjkId;
    kreditProdukOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.KreditParameter = KreditParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KreditParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KreditParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], KreditParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], KreditParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KreditParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kredit_produk_ojk_id' }),
    __metadata("design:type", Number)
], KreditParameter.prototype, "kreditProdukOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kredit_produk_ojk_entity_1.KreditProdukOjk, (kredit) => kredit.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kredit_produk_ojk_id' }),
    __metadata("design:type", kredit_produk_ojk_entity_1.KreditProdukOjk)
], KreditParameter.prototype, "kreditProdukOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kredit_produk_nilai_entity_1.KreditNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], KreditParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KreditParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KreditParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KreditParameter.prototype, "orderIndex", void 0);
exports.KreditParameter = KreditParameter = __decorate([
    (0, typeorm_1.Entity)('kredit_parameters'),
    (0, typeorm_1.Index)(['kreditProdukOjkId', 'nomor'], { unique: false })
], KreditParameter);
//# sourceMappingURL=kredit-produk-parameter.entity.js.map