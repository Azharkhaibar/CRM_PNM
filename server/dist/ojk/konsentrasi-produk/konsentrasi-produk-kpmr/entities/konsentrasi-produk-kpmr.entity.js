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
exports.KpmrKonsentrasiOjk = void 0;
const typeorm_1 = require("typeorm");
const konsentrasi_kpmr_aspek_entity_1 = require("./konsentrasi-kpmr-aspek.entity");
let KpmrKonsentrasiOjk = class KpmrKonsentrasiOjk {
    id;
    year;
    quarter;
    isActive;
    aspekList;
    summary;
    createdAt;
    updatedAt;
    createdBy;
    updatedBy;
    version;
    isLocked;
    lockedAt;
    lockedBy;
    notes;
};
exports.KpmrKonsentrasiOjk = KpmrKonsentrasiOjk;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrKonsentrasiOjk.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], KpmrKonsentrasiOjk.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], KpmrKonsentrasiOjk.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], KpmrKonsentrasiOjk.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => konsentrasi_kpmr_aspek_entity_1.KpmrAspekKonsentrasi, (aspek) => aspek.kpmrOjk, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], KpmrKonsentrasiOjk.prototype, "aspekList", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrKonsentrasiOjk.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrKonsentrasiOjk.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrKonsentrasiOjk.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], KpmrKonsentrasiOjk.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrKonsentrasiOjk.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1.0.0', name: 'version' }),
    __metadata("design:type", String)
], KpmrKonsentrasiOjk.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_locked', nullable: true }),
    __metadata("design:type", Boolean)
], KpmrKonsentrasiOjk.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_at' }),
    __metadata("design:type", Date)
], KpmrKonsentrasiOjk.prototype, "lockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_by' }),
    __metadata("design:type", String)
], KpmrKonsentrasiOjk.prototype, "lockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text', name: 'notes' }),
    __metadata("design:type", String)
], KpmrKonsentrasiOjk.prototype, "notes", void 0);
exports.KpmrKonsentrasiOjk = KpmrKonsentrasiOjk = __decorate([
    (0, typeorm_1.Entity)('kpmr_konsentrasi_ojk'),
    (0, typeorm_1.Index)(['year', 'quarter'], { unique: true }),
    (0, typeorm_1.Index)(['isActive', 'year', 'quarter']),
    (0, typeorm_1.Index)(['createdAt'])
], KpmrKonsentrasiOjk);
//# sourceMappingURL=konsentrasi-produk-kpmr.entity.js.map