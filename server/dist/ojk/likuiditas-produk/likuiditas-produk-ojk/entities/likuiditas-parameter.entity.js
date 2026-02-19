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
exports.LikuiditasParameter = void 0;
const typeorm_1 = require("typeorm");
const likuiditas_produk_ojk_entity_1 = require("./likuiditas-produk-ojk.entity");
const likuditas_nilai_entity_1 = require("./likuditas-nilai.entity");
let LikuiditasParameter = class LikuiditasParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    likuiditasProdukOjkId;
    likuiditasProdukOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.LikuiditasParameter = LikuiditasParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LikuiditasParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LikuiditasParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], LikuiditasParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], LikuiditasParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], LikuiditasParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'likuiditas_produk_ojk_id' }),
    __metadata("design:type", Number)
], LikuiditasParameter.prototype, "likuiditasProdukOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => likuiditas_produk_ojk_entity_1.LikuiditasProdukOjk, (likuiditas) => likuiditas.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'likuiditas_produk_ojk_id' }),
    __metadata("design:type", likuiditas_produk_ojk_entity_1.LikuiditasProdukOjk)
], LikuiditasParameter.prototype, "likuiditasProdukOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => likuditas_nilai_entity_1.LikuiditasNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], LikuiditasParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LikuiditasParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LikuiditasParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], LikuiditasParameter.prototype, "orderIndex", void 0);
exports.LikuiditasParameter = LikuiditasParameter = __decorate([
    (0, typeorm_1.Entity)('likuiditas_parameters'),
    (0, typeorm_1.Index)(['likuiditasProdukOjkId', 'nomor'], { unique: false })
], LikuiditasParameter);
//# sourceMappingURL=likuiditas-parameter.entity.js.map