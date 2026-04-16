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
exports.HukumParameter = void 0;
const typeorm_1 = require("typeorm");
const hukum_ojk_entity_1 = require("./hukum-ojk.entity");
const hukum_nilai_entity_1 = require("./hukum-nilai.entity");
let HukumParameter = class HukumParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    hukumOjkId;
    hukumOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.HukumParameter = HukumParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HukumParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HukumParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], HukumParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], HukumParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], HukumParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hukum_ojk_id' }),
    __metadata("design:type", Number)
], HukumParameter.prototype, "hukumOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hukum_ojk_entity_1.HukumOjk, (hukum) => hukum.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'hukum_ojk_id' }),
    __metadata("design:type", hukum_ojk_entity_1.HukumOjk)
], HukumParameter.prototype, "hukumOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hukum_nilai_entity_1.HukumNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], HukumParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HukumParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], HukumParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], HukumParameter.prototype, "orderIndex", void 0);
exports.HukumParameter = HukumParameter = __decorate([
    (0, typeorm_1.Entity)('hukum_parameters'),
    (0, typeorm_1.Index)(['hukumOjkId', 'nomor'], { unique: false })
], HukumParameter);
//# sourceMappingURL=hukum-paramater.entity.js.map