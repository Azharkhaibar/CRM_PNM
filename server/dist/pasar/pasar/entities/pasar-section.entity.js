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
exports.PasarSection = void 0;
const typeorm_1 = require("typeorm");
const pasar_entity_1 = require("./pasar.entity");
let PasarSection = class PasarSection {
    id;
    year;
    quarter;
    no;
    bobotSection;
    parameter;
    description;
    sortOrder;
    isActive;
    createdAt;
    updatedAt;
    isDeleted;
    createdBy;
    updatedBy;
    pasarIndicators;
};
exports.PasarSection = PasarSection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PasarSection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PasarSection.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] }),
    __metadata("design:type", String)
], PasarSection.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PasarSection.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bobot_section',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 100,
    }),
    __metadata("design:type", Number)
], PasarSection.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], PasarSection.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PasarSection.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_order',
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], PasarSection.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], PasarSection.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PasarSection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PasarSection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], PasarSection.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PasarSection.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'updated_by',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PasarSection.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pasar_entity_1.Pasar, (pasar) => pasar.section),
    __metadata("design:type", Array)
], PasarSection.prototype, "pasarIndicators", void 0);
exports.PasarSection = PasarSection = __decorate([
    (0, typeorm_1.Entity)('sections_pasar_holding'),
    (0, typeorm_1.Index)('IDX_PASAR_SECTION_PERIOD_UNIQUE', ['year', 'quarter', 'no', 'parameter'], { unique: true })
], PasarSection);
//# sourceMappingURL=pasar-section.entity.js.map