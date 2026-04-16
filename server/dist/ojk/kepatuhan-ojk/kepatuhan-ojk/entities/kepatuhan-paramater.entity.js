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
exports.KepatuhanParameter = void 0;
const typeorm_1 = require("typeorm");
const kepatuhan_ojk_entity_1 = require("./kepatuhan-ojk.entity");
const kepatuhan_nilai_entity_1 = require("./kepatuhan-nilai.entity");
let KepatuhanParameter = class KepatuhanParameter {
    id;
    nomor;
    judul;
    bobot;
    kategori;
    kepatuhanId;
    kepatuhan;
    nilaiList;
    createdAt;
    updatedAt;
    orderIndex;
};
exports.KepatuhanParameter = KepatuhanParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KepatuhanParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KepatuhanParameter.prototype, "nomor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], KepatuhanParameter.prototype, "judul", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], KepatuhanParameter.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KepatuhanParameter.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kepatuhan_produk_ojk_id' }),
    __metadata("design:type", Number)
], KepatuhanParameter.prototype, "kepatuhanId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kepatuhan_ojk_entity_1.KepatuhanOjk, (kepatuhan) => kepatuhan.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'kepatuhan_produk_ojk_id' }),
    __metadata("design:type", kepatuhan_ojk_entity_1.KepatuhanOjk)
], KepatuhanParameter.prototype, "kepatuhan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kepatuhan_nilai_entity_1.KepatuhanNilai, (nilai) => nilai.parameter, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], KepatuhanParameter.prototype, "nilaiList", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KepatuhanParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KepatuhanParameter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'order_index' }),
    __metadata("design:type", Number)
], KepatuhanParameter.prototype, "orderIndex", void 0);
exports.KepatuhanParameter = KepatuhanParameter = __decorate([
    (0, typeorm_1.Entity)('kepatuhan_parameters'),
    (0, typeorm_1.Index)(['kepatuhanId', 'nomor'], { unique: false })
], KepatuhanParameter);
//# sourceMappingURL=kepatuhan-paramater.entity.js.map