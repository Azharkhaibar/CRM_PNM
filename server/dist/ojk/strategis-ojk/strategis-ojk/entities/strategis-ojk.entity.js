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
exports.StrategisOjk = void 0;
const typeorm_1 = require("typeorm");
const strategis_paramater_entity_1 = require("./strategis-paramater.entity");
let StrategisOjk = class StrategisOjk {
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
exports.StrategisOjk = StrategisOjk;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StrategisOjk.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], StrategisOjk.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], StrategisOjk.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], StrategisOjk.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => strategis_paramater_entity_1.StrategisParameter, (parameter) => parameter.strategisOjk, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], StrategisOjk.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], StrategisOjk.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StrategisOjk.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StrategisOjk.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], StrategisOjk.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'updated_by' }),
    __metadata("design:type", String)
], StrategisOjk.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1.0.0', name: 'version' }),
    __metadata("design:type", String)
], StrategisOjk.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_locked' }),
    __metadata("design:type", Boolean)
], StrategisOjk.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_at' }),
    __metadata("design:type", Date)
], StrategisOjk.prototype, "lockedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'locked_by' }),
    __metadata("design:type", String)
], StrategisOjk.prototype, "lockedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text', name: 'notes' }),
    __metadata("design:type", String)
], StrategisOjk.prototype, "notes", void 0);
exports.StrategisOjk = StrategisOjk = __decorate([
    (0, typeorm_1.Entity)('strategis_ojk'),
    (0, typeorm_1.Index)(['year', 'quarter'], { unique: true })
], StrategisOjk);
//# sourceMappingURL=strategis-ojk.entity.js.map