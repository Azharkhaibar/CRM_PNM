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
exports.KepatuhanNilai = void 0;
const typeorm_1 = require("typeorm");
const kepatuhan_paramater_entity_1 = require("./kepatuhan-paramater.entity");
let KepatuhanNilai = class KepatuhanNilai {
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
exports.KepatuhanNilai = KepatuhanNilai;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KepatuhanNilai.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KepatuhanNilai.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KepatuhanNilai.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], KepatuhanNilai.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KepatuhanNilai.prototype, "portofolio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KepatuhanNilai.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KepatuhanNilai.prototype, "riskindikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parameter_id' }),
    __metadata("design:type", Number)
], KepatuhanNilai.prototype, "parameterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kepatuhan_paramater_entity_1.KepatuhanParameter, (parameter) => parameter.nilaiList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parameter_id' }),
    __metadata("design:type", kepatuhan_paramater_entity_1.KepatuhanParameter)
], KepatuhanNilai.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KepatuhanNilai.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KepatuhanNilai.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KepatuhanNilai.prototype, "orderIndex", void 0);
exports.KepatuhanNilai = KepatuhanNilai = __decorate([
    (0, typeorm_1.Entity)('kepatuhan_nilai'),
    (0, typeorm_1.Index)(['parameterId', 'nomor'], { unique: false })
], KepatuhanNilai);
//# sourceMappingURL=kepatuhan-nilai.entity.js.map