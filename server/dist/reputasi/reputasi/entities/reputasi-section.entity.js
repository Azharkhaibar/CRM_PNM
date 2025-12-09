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
exports.ReputasiSection = void 0;
const typeorm_1 = require("typeorm");
const reputasi_entity_1 = require("./reputasi.entity");
let ReputasiSection = class ReputasiSection {
    id;
    no;
    bobotSection;
    parameter;
    description;
    category;
    sortOrder;
    createdAt;
    updatedAt;
    isDeleted;
    reputasi;
};
exports.ReputasiSection = ReputasiSection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReputasiSection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], ReputasiSection.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bobot_section',
        type: 'decimal',
        precision: 5,
        scale: 2,
    }),
    __metadata("design:type", Number)
], ReputasiSection.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], ReputasiSection.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ReputasiSection.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ReputasiSection.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_order',
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], ReputasiSection.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReputasiSection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ReputasiSection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ReputasiSection.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reputasi_entity_1.Reputasi, (reputasi) => reputasi.section),
    __metadata("design:type", Array)
], ReputasiSection.prototype, "reputasi", void 0);
exports.ReputasiSection = ReputasiSection = __decorate([
    (0, typeorm_1.Entity)('reputasi_sections')
], ReputasiSection);
//# sourceMappingURL=reputasi-section.entity.js.map