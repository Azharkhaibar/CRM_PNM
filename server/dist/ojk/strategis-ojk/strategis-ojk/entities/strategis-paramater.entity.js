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
exports.StrategisParameter = void 0;
const typeorm_1 = require("typeorm");
const strategis_ojk_entity_1 = require("./strategis-ojk.entity");
const strategis_nilai_entity_1 = require("./strategis-nilai.entity");
let StrategisParameter = class StrategisParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    strategisOjkId;
    strategisOjk;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.StrategisParameter = StrategisParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StrategisParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StrategisParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], StrategisParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], StrategisParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], StrategisParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'strategis_ojk_id' }),
    __metadata("design:type", Number)
], StrategisParameter.prototype, "strategisOjkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => strategis_ojk_entity_1.StrategisOjk, (strategis) => strategis.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'strategis_ojk_id' }),
    __metadata("design:type", strategis_ojk_entity_1.StrategisOjk)
], StrategisParameter.prototype, "strategisOjk", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => strategis_nilai_entity_1.StrategisNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], StrategisParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StrategisParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StrategisParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], StrategisParameter.prototype, "orderIndex", void 0);
exports.StrategisParameter = StrategisParameter = __decorate([
    (0, typeorm_1.Entity)('strategis_parameters'),
    (0, typeorm_1.Index)(['strategisOjkId', 'nomor'], { unique: false })
], StrategisParameter);
//# sourceMappingURL=strategis-paramater.entity.js.map