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
exports.SectionOperational = void 0;
const typeorm_1 = require("typeorm");
const operasional_entity_1 = require("./operasional.entity");
let SectionOperational = class SectionOperational {
    id;
    year;
    quarter;
    no;
    bobotSection;
    parameter;
    createdAt;
    updatedAt;
    isDeleted;
    deletedAt;
    indikators;
};
exports.SectionOperational = SectionOperational;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SectionOperational.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SectionOperational.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 2,
    }),
    __metadata("design:type", String)
], SectionOperational.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SectionOperational.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'bobot_section',
    }),
    __metadata("design:type", Number)
], SectionOperational.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        name: 'parameter',
    }),
    __metadata("design:type", String)
], SectionOperational.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SectionOperational.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SectionOperational.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_deleted',
    }),
    __metadata("design:type", Boolean)
], SectionOperational.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        nullable: true,
        name: 'deleted_at',
    }),
    __metadata("design:type", Object)
], SectionOperational.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => operasional_entity_1.Operational, (operational) => operational.section, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], SectionOperational.prototype, "indikators", void 0);
exports.SectionOperational = SectionOperational = __decorate([
    (0, typeorm_1.Entity)('sections_operational'),
    (0, typeorm_1.Index)('IDX_SECTION_OPERATIONAL_PERIOD', ['year', 'quarter'])
], SectionOperational);
//# sourceMappingURL=operasional-section.entity.js.map