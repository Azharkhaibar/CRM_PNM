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
exports.KpmrPertanyaanStrategis = void 0;
const typeorm_1 = require("typeorm");
const strategis_kpmr_aspek_entity_1 = require("./strategis-kpmr-aspek.entity");
let KpmrPertanyaanStrategis = class KpmrPertanyaanStrategis {
    id;
    nomor;
    pertanyaan;
    skor = {};
    indicator;
    evidence;
    catatan;
    aspekId;
    aspek;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.KpmrPertanyaanStrategis = KpmrPertanyaanStrategis;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrPertanyaanStrategis.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanStrategis.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], KpmrPertanyaanStrategis.prototype, "pertanyaan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrPertanyaanStrategis.prototype, "skor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrPertanyaanStrategis.prototype, "indicator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanStrategis.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], KpmrPertanyaanStrategis.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aspek_id' }),
    __metadata("design:type", Number)
], KpmrPertanyaanStrategis.prototype, "aspekId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => strategis_kpmr_aspek_entity_1.KpmrAspekStrategis, (aspek) => aspek.pertanyaanList, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'aspek_id' }),
    __metadata("design:type", strategis_kpmr_aspek_entity_1.KpmrAspekStrategis)
], KpmrPertanyaanStrategis.prototype, "aspek", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrPertanyaanStrategis.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrPertanyaanStrategis.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KpmrPertanyaanStrategis.prototype, "orderIndex", void 0);
exports.KpmrPertanyaanStrategis = KpmrPertanyaanStrategis = __decorate([
    (0, typeorm_1.Entity)('kpmr_pertanyaan_strategis'),
    (0, typeorm_1.Index)(['aspekId', 'nomor'], { unique: false }),
    (0, typeorm_1.Index)(['aspekId', 'orderIndex'], { unique: false }),
    (0, typeorm_1.Index)(['aspekId', 'createdAt'])
], KpmrPertanyaanStrategis);
//# sourceMappingURL=strategis-kpmr-pertanyaan.entity.js.map