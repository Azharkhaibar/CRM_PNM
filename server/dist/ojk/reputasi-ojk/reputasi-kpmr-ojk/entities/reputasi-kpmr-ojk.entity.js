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
exports.KpmrReputasiOjk = void 0;
const typeorm_1 = require("typeorm");
const reputasi_kpmr_aspek_entity_1 = require("./reputasi-kpmr-aspek.entity");
let KpmrReputasiOjk = class KpmrReputasiOjk {
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
exports.KpmrReputasiOjk = KpmrReputasiOjk;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrReputasiOjk.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], KpmrReputasiOjk.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], KpmrReputasiOjk.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], KpmrReputasiOjk.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reputasi_kpmr_aspek_entity_1.KpmrAspekReputasi, (aspek) => aspek.kpmrReputasi, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], KpmrReputasiOjk.prototype, "aspekList", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], KpmrReputasiOjk.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KpmrReputasiOjk.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KpmrReputasiOjk.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], KpmrReputasiOjk.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], KpmrReputasiOjk.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1.0.0', name: 'version' }),
    __metadata("design:type", String)
], KpmrReputasiOjk.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_locked', nullable: true }),
    __metadata("design:type", Boolean)
], KpmrReputasiOjk.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_at' }),
    __metadata("design:type", Date)
], KpmrReputasiOjk.prototype, "lockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_by' }),
    __metadata("design:type", String)
], KpmrReputasiOjk.prototype, "lockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text', name: 'notes' }),
    __metadata("design:type", String)
], KpmrReputasiOjk.prototype, "notes", void 0);
exports.KpmrReputasiOjk = KpmrReputasiOjk = __decorate([
    (0, typeorm_1.Entity)('kpmr_reputasi_ojk'),
    (0, typeorm_1.Index)(['year', 'quarter'], { unique: true }),
    (0, typeorm_1.Index)(['isActive', 'year', 'quarter']),
    (0, typeorm_1.Index)(['createdAt'])
], KpmrReputasiOjk);
//# sourceMappingURL=reputasi-kpmr-ojk.entity.js.map