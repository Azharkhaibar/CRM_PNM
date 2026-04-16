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
exports.ReputasiOjk = void 0;
const typeorm_1 = require("typeorm");
const reputasi_paramater_entity_1 = require("./reputasi-paramater.entity");
let ReputasiOjk = class ReputasiOjk {
    id;
    year;
    quarter;
    isActive;
    parameters;
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
exports.ReputasiOjk = ReputasiOjk;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReputasiOjk.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ReputasiOjk.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ReputasiOjk.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], ReputasiOjk.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reputasi_paramater_entity_1.ReputasiParameter, (parameter) => parameter.reputasiOjk, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], ReputasiOjk.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ReputasiOjk.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReputasiOjk.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ReputasiOjk.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], ReputasiOjk.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], ReputasiOjk.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1.0.0', name: 'version' }),
    __metadata("design:type", String)
], ReputasiOjk.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_locked' }),
    __metadata("design:type", Boolean)
], ReputasiOjk.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_at' }),
    __metadata("design:type", Date)
], ReputasiOjk.prototype, "lockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_by' }),
    __metadata("design:type", String)
], ReputasiOjk.prototype, "lockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text', name: 'notes' }),
    __metadata("design:type", String)
], ReputasiOjk.prototype, "notes", void 0);
exports.ReputasiOjk = ReputasiOjk = __decorate([
    (0, typeorm_1.Entity)('reputasi_ojk'),
    (0, typeorm_1.Index)(['year', 'quarter'], { unique: true })
], ReputasiOjk);
//# sourceMappingURL=reputasi-ojk.entity.js.map