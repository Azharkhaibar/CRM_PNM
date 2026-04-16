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
exports.KPMRLikuiditasScore = void 0;
const typeorm_1 = require("typeorm");
const kpmr_likuiditas_definisi_entity_1 = require("./kpmr-likuiditas-definisi.entity");
let KPMRLikuiditasScore = class KPMRLikuiditasScore {
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
exports.KPMRLikuiditasScore = KPMRLikuiditasScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPMRLikuiditasScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'definition_id' }),
    __metadata("design:type", Number)
], KPMRLikuiditasScore.prototype, "definitionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kpmr_likuiditas_definisi_entity_1.KPMRLikuiditasDefinition, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'definition_id' }),
    __metadata("design:type", kpmr_likuiditas_definisi_entity_1.KPMRLikuiditasDefinition)
], KPMRLikuiditasScore.prototype, "definition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KPMRLikuiditasScore.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], KPMRLikuiditasScore.prototype, "quarter", void 0);
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
], KPMRLikuiditasScore.prototype, "sectionSkor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasScore.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasScore.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], KPMRLikuiditasScore.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], KPMRLikuiditasScore.prototype, "updatedBy", void 0);
exports.KPMRLikuiditasScore = KPMRLikuiditasScore = __decorate([
    (0, typeorm_1.Entity)('kpmr_likuiditas_skor_holding'),
    (0, typeorm_1.Index)('IDX_KPMR_LIKUIDITAS_SCORE_DEF_QUARTER', ['definitionId', 'year', 'quarter'], {
        unique: true,
    })
], KPMRLikuiditasScore);
//# sourceMappingURL=kpmr-likuiditas-skor.entity.js.map