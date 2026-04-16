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
exports.HukumNilai = void 0;
const typeorm_1 = require("typeorm");
const hukum_paramater_entity_1 = require("./hukum-paramater.entity");
let HukumNilai = class HukumNilai {
    id;
    nomor;
    judul;
    bobot;
    portofolio;
    keterangan;
    riskindikator;
    parameterId;
    parameter;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.HukumNilai = HukumNilai;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HukumNilai.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HukumNilai.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], HukumNilai.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], HukumNilai.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HukumNilai.prototype, "portofolio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HukumNilai.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], HukumNilai.prototype, "riskindikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parameter_id' }),
    __metadata("design:type", Number)
], HukumNilai.prototype, "parameterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hukum_paramater_entity_1.HukumParameter, (parameter) => parameter.nilaiList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parameter_id' }),
    __metadata("design:type", hukum_paramater_entity_1.HukumParameter)
], HukumNilai.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HukumNilai.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], HukumNilai.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], HukumNilai.prototype, "orderIndex", void 0);
exports.HukumNilai = HukumNilai = __decorate([
    (0, typeorm_1.Entity)('hukum_nilai'),
    (0, typeorm_1.Index)(['parameterId', 'nomor'], { unique: false })
], HukumNilai);
//# sourceMappingURL=hukum-nilai.entity.js.map