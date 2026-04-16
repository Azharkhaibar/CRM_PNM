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
exports.KPMRLikuiditasDefinition = void 0;
const typeorm_1 = require("typeorm");
const kpmr_likuiditas_pertanyaan_entity_1 = require("./kpmr-likuiditas-pertanyaan.entity");
const kpmr_likuiditas_skor_entity_1 = require("./kpmr-likuiditas-skor.entity");
let KPMRLikuiditasDefinition = class KPMRLikuiditasDefinition {
    id;
    year;
    aspekNo;
    aspekTitle;
    aspekBobot;
    sectionNo;
    question;
    sectionTitle;
    level1;
    level2;
    level3;
    level4;
    level5;
    evidence;
    createdAt;
    updatedAt;
    createdBy;
    updatedBy;
    scores;
};
exports.KPMRLikuiditasDefinition = KPMRLikuiditasDefinition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPMRLikuiditasDefinition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KPMRLikuiditasDefinition.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'aspek_no' }),
    __metadata("design:type", String)
], KPMRLikuiditasDefinition.prototype, "aspekNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'aspek_title' }),
    __metadata("design:type", String)
], KPMRLikuiditasDefinition.prototype, "aspekTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
        name: 'aspek_bobot',
        default: 0,
    }),
    __metadata("design:type", Number)
], KPMRLikuiditasDefinition.prototype, "aspekBobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'section_no' }),
    __metadata("design:type", String)
], KPMRLikuiditasDefinition.prototype, "sectionNo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kpmr_likuiditas_pertanyaan_entity_1.KPMRLikuiditasQuestion, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)([
        { name: 'year', referencedColumnName: 'year' },
        { name: 'aspek_no', referencedColumnName: 'aspekNo' },
        { name: 'section_no', referencedColumnName: 'sectionNo' },
    ]),
    __metadata("design:type", kpmr_likuiditas_pertanyaan_entity_1.KPMRLikuiditasQuestion)
], KPMRLikuiditasDefinition.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'section_title' }),
    __metadata("design:type", String)
], KPMRLikuiditasDefinition.prototype, "sectionTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'level_1' }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "level1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'level_2' }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "level2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'level_3' }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "level3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'level_4' }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "level4", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'level_5' }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "level5", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasDefinition.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasDefinition.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], KPMRLikuiditasDefinition.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpmr_likuiditas_skor_entity_1.KPMRLikuiditasScore, (score) => score.definition),
    __metadata("design:type", Array)
], KPMRLikuiditasDefinition.prototype, "scores", void 0);
exports.KPMRLikuiditasDefinition = KPMRLikuiditasDefinition = __decorate([
    (0, typeorm_1.Entity)('kpmr_likuiditas_definisi_holding'),
    (0, typeorm_1.Index)('IDX_KPMR_LIKUIDITAS_DEF_YEAR_ASPECT', ['year', 'aspekNo', 'sectionNo'], {
        unique: true,
    })
], KPMRLikuiditasDefinition);
//# sourceMappingURL=kpmr-likuiditas-definisi.entity.js.map