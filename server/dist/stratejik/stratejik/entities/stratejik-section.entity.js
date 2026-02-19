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
exports.StrategikSection = void 0;
const typeorm_1 = require("typeorm");
const stratejik_entity_1 = require("./stratejik.entity");
let StrategikSection = class StrategikSection {
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
    strategikIndicators;
};
exports.StrategikSection = StrategikSection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StrategikSection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StrategikSection.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] }),
    __metadata("design:type", String)
], StrategikSection.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], StrategikSection.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bobot_section',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 100,
    }),
    __metadata("design:type", Number)
], StrategikSection.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], StrategikSection.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StrategikSection.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_order',
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], StrategikSection.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], StrategikSection.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StrategikSection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StrategikSection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], StrategikSection.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stratejik_entity_1.Strategik, (strategik) => strategik.section),
    __metadata("design:type", Array)
], StrategikSection.prototype, "strategikIndicators", void 0);
exports.StrategikSection = StrategikSection = __decorate([
    (0, typeorm_1.Entity)('sections_strategik'),
    (0, typeorm_1.Index)('IDX_STRATEGIK_SECTION_PERIOD_UNIQUE', ['year', 'quarter', 'no', 'parameter'], { unique: true })
], StrategikSection);
//# sourceMappingURL=stratejik-section.entity.js.map