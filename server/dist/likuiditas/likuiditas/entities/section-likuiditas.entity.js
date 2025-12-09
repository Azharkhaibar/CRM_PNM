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
exports.SectionLikuiditas = void 0;
const typeorm_1 = require("typeorm");
const likuiditas_entity_1 = require("./likuiditas.entity");
let SectionLikuiditas = class SectionLikuiditas {
    id;
    year;
    quarter;
    no;
    bobotSection;
    parameter;
    description;
    createdAt;
    updatedAt;
    isDeleted;
    deletedAt;
    indikators;
};
exports.SectionLikuiditas = SectionLikuiditas;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SectionLikuiditas.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SectionLikuiditas.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 2,
    }),
    __metadata("design:type", String)
], SectionLikuiditas.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SectionLikuiditas.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'bobot_section',
    }),
    __metadata("design:type", Number)
], SectionLikuiditas.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        name: 'parameter',
    }),
    __metadata("design:type", String)
], SectionLikuiditas.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 500,
        nullable: true,
        name: 'description',
    }),
    __metadata("design:type", Object)
], SectionLikuiditas.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SectionLikuiditas.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SectionLikuiditas.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        name: 'is_deleted',
    }),
    __metadata("design:type", Boolean)
], SectionLikuiditas.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        nullable: true,
        name: 'deleted_at',
    }),
    __metadata("design:type", Object)
], SectionLikuiditas.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => likuiditas_entity_1.Likuiditas, (likuiditas) => likuiditas.section, {
        cascade: true,
        eager: false,
    }),
    __metadata("design:type", Array)
], SectionLikuiditas.prototype, "indikators", void 0);
exports.SectionLikuiditas = SectionLikuiditas = __decorate([
    (0, typeorm_1.Entity)('sections_likuiditas'),
    (0, typeorm_1.Index)('IDX_SECTION_PERIOD', ['year', 'quarter'])
], SectionLikuiditas);
//# sourceMappingURL=section-likuiditas.entity.js.map