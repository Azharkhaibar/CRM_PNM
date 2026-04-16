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
exports.KPMRPasarQuestion = void 0;
const typeorm_1 = require("typeorm");
const kpmr_pasar_aspek_entity_1 = require("./kpmr-pasar-aspek.entity");
const kpmr_pasar_definisi_entity_1 = require("./kpmr-pasar-definisi.entity");
let KPMRPasarQuestion = class KPMRPasarQuestion {
    id;
    year;
    aspekNo;
    sectionNo;
    sectionTitle;
    createdAt;
    updatedAt;
    aspect;
    definitions;
};
exports.KPMRPasarQuestion = KPMRPasarQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPMRPasarQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KPMRPasarQuestion.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'aspek_no' }),
    __metadata("design:type", String)
], KPMRPasarQuestion.prototype, "aspekNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'section_no' }),
    __metadata("design:type", String)
], KPMRPasarQuestion.prototype, "sectionNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'section_title' }),
    __metadata("design:type", String)
], KPMRPasarQuestion.prototype, "sectionTitle", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KPMRPasarQuestion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KPMRPasarQuestion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => kpmr_pasar_aspek_entity_1.KPMRPasarAspect, (aspect) => aspect.questions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([
        { name: 'year', referencedColumnName: 'year' },
        { name: 'aspek_no', referencedColumnName: 'aspekNo' },
    ]),
    __metadata("design:type", kpmr_pasar_aspek_entity_1.KPMRPasarAspect)
], KPMRPasarQuestion.prototype, "aspect", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpmr_pasar_definisi_entity_1.KPMRPasarDefinition, (definition) => definition.question),
    __metadata("design:type", Array)
], KPMRPasarQuestion.prototype, "definitions", void 0);
exports.KPMRPasarQuestion = KPMRPasarQuestion = __decorate([
    (0, typeorm_1.Entity)('kpmr_pasar_pertanyaan_holding'),
    (0, typeorm_1.Index)('UQ_PASAR_QUESTION_YEAR_ASPECT_SECTION', ['year', 'aspekNo', 'sectionNo'], {
        unique: true,
    })
], KPMRPasarQuestion);
//# sourceMappingURL=kpmr-pasar-pertanyaan.entity.js.map