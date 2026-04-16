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
exports.StrategisNilai = void 0;
const typeorm_1 = require("typeorm");
const strategis_paramater_entity_1 = require("./strategis-paramater.entity");
let StrategisNilai = class StrategisNilai {
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
exports.StrategisNilai = StrategisNilai;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StrategisNilai.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StrategisNilai.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], StrategisNilai.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], StrategisNilai.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StrategisNilai.prototype, "portofolio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StrategisNilai.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], StrategisNilai.prototype, "riskindikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parameter_id' }),
    __metadata("design:type", Number)
], StrategisNilai.prototype, "parameterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => strategis_paramater_entity_1.StrategisParameter, (parameter) => parameter.nilaiList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parameter_id' }),
    __metadata("design:type", strategis_paramater_entity_1.StrategisParameter)
], StrategisNilai.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StrategisNilai.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StrategisNilai.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], StrategisNilai.prototype, "orderIndex", void 0);
exports.StrategisNilai = StrategisNilai = __decorate([
    (0, typeorm_1.Entity)('strategis_nilai'),
    (0, typeorm_1.Index)(['parameterId', 'nomor'], { unique: false })
], StrategisNilai);
//# sourceMappingURL=strategis-nilai.entity.js.map