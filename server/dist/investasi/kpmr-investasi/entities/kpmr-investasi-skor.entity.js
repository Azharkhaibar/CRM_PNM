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
exports.KPMRScore = void 0;
const typeorm_1 = require("typeorm");
const kpmr_investasi_definisi_entity_1 = require("./kpmr-investasi-definisi.entity");
let KPMRScore = class KPMRScore {
    id;
    definitionId;
    definition;
    year;
    quarter;
    sectionSkor;
    createdAt;
    updatedAt;
    createdBy;
    updatedBy;
};
exports.KPMRScore = KPMRScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPMRScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'definition_id' }),
    __metadata("design:type", Number)
], KPMRScore.prototype, "definitionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kpmr_investasi_definisi_entity_1.KPMRDefinition, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'definition_id' }),
    __metadata("design:type", kpmr_investasi_definisi_entity_1.KPMRDefinition)
], KPMRScore.prototype, "definition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KPMRScore.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], KPMRScore.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
        name: 'section_skor',
        transformer: {
            to: (value) => value,
            from: (value) => (value ? Number(value) : null),
        },
    }),
    __metadata("design:type", Object)
], KPMRScore.prototype, "sectionSkor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KPMRScore.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KPMRScore.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], KPMRScore.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], KPMRScore.prototype, "updatedBy", void 0);
exports.KPMRScore = KPMRScore = __decorate([
    (0, typeorm_1.Entity)('kpmr_investasi_skor_holding'),
    (0, typeorm_1.Index)('IDX_KPMR_SCORE_DEF_QUARTER', ['definitionId', 'year', 'quarter'], {
        unique: true,
    })
], KPMRScore);
//# sourceMappingURL=kpmr-investasi-skor.entity.js.map