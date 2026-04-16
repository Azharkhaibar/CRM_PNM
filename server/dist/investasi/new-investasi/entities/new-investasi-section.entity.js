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
exports.InvestasiSection = void 0;
const typeorm_1 = require("typeorm");
const new_investasi_entity_1 = require("./new-investasi.entity");
let InvestasiSection = class InvestasiSection {
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
    investasiIndicators;
};
exports.InvestasiSection = InvestasiSection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InvestasiSection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], InvestasiSection.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Q1', 'Q2', 'Q3', 'Q4'] }),
    __metadata("design:type", String)
], InvestasiSection.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], InvestasiSection.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bobot_section',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 100,
    }),
    __metadata("design:type", Number)
], InvestasiSection.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], InvestasiSection.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], InvestasiSection.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_order',
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], InvestasiSection.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], InvestasiSection.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InvestasiSection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], InvestasiSection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], InvestasiSection.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'created_by',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], InvestasiSection.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'updated_by',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], InvestasiSection.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => new_investasi_entity_1.Investasi, (investasi) => investasi.section),
    __metadata("design:type", Array)
], InvestasiSection.prototype, "investasiIndicators", void 0);
exports.InvestasiSection = InvestasiSection = __decorate([
    (0, typeorm_1.Entity)('sections_investasi_holding'),
    (0, typeorm_1.Index)('IDX_INVESTASI_SECTION_PERIOD_UNIQUE', ['year', 'quarter', 'no', 'parameter'], { unique: true })
], InvestasiSection);
//# sourceMappingURL=new-investasi-section.entity.js.map