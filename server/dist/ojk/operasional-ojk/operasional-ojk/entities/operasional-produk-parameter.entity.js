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
exports.OperasionalParameter = void 0;
const typeorm_1 = require("typeorm");
const operasional_ojk_entity_1 = require("./operasional-ojk.entity");
const operasional_produk_nilai_entity_1 = require("./operasional-produk-nilai.entity");
let OperasionalParameter = class OperasionalParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    operasionalId;
    operasional;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.OperasionalParameter = OperasionalParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OperasionalParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OperasionalParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], OperasionalParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], OperasionalParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], OperasionalParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operasional_ojk_id' }),
    __metadata("design:type", Number)
], OperasionalParameter.prototype, "operasionalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => operasional_ojk_entity_1.Operasional, (operasional) => operasional.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'operasional_ojk_id' }),
    __metadata("design:type", operasional_ojk_entity_1.Operasional)
], OperasionalParameter.prototype, "operasional", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => operasional_produk_nilai_entity_1.OperasionalNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], OperasionalParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OperasionalParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], OperasionalParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], OperasionalParameter.prototype, "orderIndex", void 0);
exports.OperasionalParameter = OperasionalParameter = __decorate([
    (0, typeorm_1.Entity)('operasional_parameters_ojk'),
    (0, typeorm_1.Index)(['operasionalId', 'nomor'], { unique: false })
], OperasionalParameter);
//# sourceMappingURL=operasional-produk-parameter.entity.js.map