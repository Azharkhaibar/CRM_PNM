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
exports.Operasional = void 0;
const typeorm_1 = require("typeorm");
const operasional_produk_parameter_entity_1 = require("./operasional-produk-parameter.entity");
let Operasional = class Operasional {
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
exports.Operasional = Operasional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Operasional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Operasional.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Operasional.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Operasional.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => operasional_produk_parameter_entity_1.OperasionalParameter, (parameter) => parameter.operasional, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], Operasional.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Operasional.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Operasional.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Operasional.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], Operasional.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], Operasional.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1.0.0', name: 'version' }),
    __metadata("design:type", String)
], Operasional.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_locked' }),
    __metadata("design:type", Boolean)
], Operasional.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_at' }),
    __metadata("design:type", Date)
], Operasional.prototype, "lockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_by' }),
    __metadata("design:type", String)
], Operasional.prototype, "lockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text', name: 'notes' }),
    __metadata("design:type", String)
], Operasional.prototype, "notes", void 0);
exports.Operasional = Operasional = __decorate([
    (0, typeorm_1.Entity)('operasional_ojk'),
    (0, typeorm_1.Index)(['year', 'quarter'], { unique: true })
], Operasional);
//# sourceMappingURL=operasional-ojk.entity.js.map