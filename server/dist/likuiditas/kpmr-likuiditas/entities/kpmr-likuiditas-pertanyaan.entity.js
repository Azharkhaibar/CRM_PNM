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
exports.KPMRLikuiditasQuestion = void 0;
const typeorm_1 = require("typeorm");
const kpmr_likuiditas_aspek_entity_1 = require("./kpmr-likuiditas-aspek.entity");
const kpmr_likuiditas_definisi_entity_1 = require("./kpmr-likuiditas-definisi.entity");
let KPMRLikuiditasQuestion = class KPMRLikuiditasQuestion {
    id;
    year;
    aspekNo;
    aspect;
    sectionNo;
    sectionTitle;
    createdAt;
    updatedAt;
    definitions;
};
exports.KPMRLikuiditasQuestion = KPMRLikuiditasQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPMRLikuiditasQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KPMRLikuiditasQuestion.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'aspek_no' }),
    __metadata("design:type", String)
], KPMRLikuiditasQuestion.prototype, "aspekNo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kpmr_likuiditas_aspek_entity_1.KPMRLikuiditasAspect, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)([
        { name: 'year', referencedColumnName: 'year' },
        { name: 'aspek_no', referencedColumnName: 'aspekNo' },
    ]),
    __metadata("design:type", kpmr_likuiditas_aspek_entity_1.KPMRLikuiditasAspect)
], KPMRLikuiditasQuestion.prototype, "aspect", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'section_no' }),
    __metadata("design:type", String)
], KPMRLikuiditasQuestion.prototype, "sectionNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'section_title' }),
    __metadata("design:type", String)
], KPMRLikuiditasQuestion.prototype, "sectionTitle", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasQuestion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasQuestion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpmr_likuiditas_definisi_entity_1.KPMRLikuiditasDefinition, (definition) => definition.question),
    __metadata("design:type", Array)
], KPMRLikuiditasQuestion.prototype, "definitions", void 0);
exports.KPMRLikuiditasQuestion = KPMRLikuiditasQuestion = __decorate([
    (0, typeorm_1.Entity)('kpmr_likuiditas_pertanyaan_holding'),
    (0, typeorm_1.Index)('IDX_KPMR_LIKUIDITAS_QUESTION_ASPECT', ['year', 'aspekNo'])
], KPMRLikuiditasQuestion);
//# sourceMappingURL=kpmr-likuiditas-pertanyaan.entity.js.map