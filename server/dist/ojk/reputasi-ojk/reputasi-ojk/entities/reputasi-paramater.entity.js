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
exports.ReputasiParameter = void 0;
const typeorm_1 = require("typeorm");
const reputasi_ojk_entity_1 = require("./reputasi-ojk.entity");
const reputasi_nilai_entity_1 = require("./reputasi-nilai.entity");
let ReputasiParameter = class ReputasiParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    reputasiOjkId;
    reputasiOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.ReputasiParameter = ReputasiParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReputasiParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReputasiParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ReputasiParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], ReputasiParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ReputasiParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reputasi_ojk_id' }),
    __metadata("design:type", Number)
], ReputasiParameter.prototype, "reputasiOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reputasi_ojk_entity_1.ReputasiOjk, (reputasi) => reputasi.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'reputasi_ojk_id' }),
    __metadata("design:type", reputasi_ojk_entity_1.ReputasiOjk)
], ReputasiParameter.prototype, "reputasiOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reputasi_nilai_entity_1.ReputasiNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], ReputasiParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReputasiParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ReputasiParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], ReputasiParameter.prototype, "orderIndex", void 0);
exports.ReputasiParameter = ReputasiParameter = __decorate([
    (0, typeorm_1.Entity)('reputasi_parameters'),
    (0, typeorm_1.Index)(['reputasiOjkId', 'nomor'], { unique: false })
], ReputasiParameter);
//# sourceMappingURL=reputasi-paramater.entity.js.map