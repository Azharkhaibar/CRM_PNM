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
exports.RentabilitasParameter = void 0;
const typeorm_1 = require("typeorm");
const rentabilitas_nilai_entity_1 = require("./rentabilitas-nilai.entity");
const rentabilitas_ojk_entity_1 = require("./rentabilitas-ojk.entity");
let RentabilitasParameter = class RentabilitasParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    rentabilitasProdukOjkId;
    rentabilitasProdukOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.RentabilitasParameter = RentabilitasParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RentabilitasParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RentabilitasParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], RentabilitasParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], RentabilitasParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], RentabilitasParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rentabilitas_produk_ojk_id' }),
    __metadata("design:type", Number)
], RentabilitasParameter.prototype, "rentabilitasProdukOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rentabilitas_ojk_entity_1.RentabilitasProdukOjk, (rentabilitas) => rentabilitas.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'rentabilitas_produk_ojk_id' }),
    __metadata("design:type", rentabilitas_ojk_entity_1.RentabilitasProdukOjk)
], RentabilitasParameter.prototype, "rentabilitasProdukOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rentabilitas_nilai_entity_1.RentabilitasNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], RentabilitasParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RentabilitasParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RentabilitasParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], RentabilitasParameter.prototype, "orderIndex", void 0);
exports.RentabilitasParameter = RentabilitasParameter = __decorate([
    (0, typeorm_1.Entity)('rentabilitas_parameters'),
    (0, typeorm_1.Index)(['rentabilitasProdukOjkId', 'nomor'], { unique: false })
], RentabilitasParameter);
//# sourceMappingURL=rentabilitas-parameter.entity.js.map