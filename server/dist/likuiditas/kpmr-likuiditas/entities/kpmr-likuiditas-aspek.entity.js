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
exports.KPMRLikuiditasAspect = void 0;
const typeorm_1 = require("typeorm");
const kpmr_likuiditas_pertanyaan_entity_1 = require("./kpmr-likuiditas-pertanyaan.entity");
let KPMRLikuiditasAspect = class KPMRLikuiditasAspect {
    id;
    year;
    aspekNo;
    aspekTitle;
    aspekBobot;
    createdAt;
    updatedAt;
    questions;
};
exports.KPMRLikuiditasAspect = KPMRLikuiditasAspect;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KPMRLikuiditasAspect.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KPMRLikuiditasAspect.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'aspek_no' }),
    __metadata("design:type", String)
], KPMRLikuiditasAspect.prototype, "aspekNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'aspek_title' }),
    __metadata("design:type", String)
], KPMRLikuiditasAspect.prototype, "aspekTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'aspek_bobot' }),
    __metadata("design:type", Number)
], KPMRLikuiditasAspect.prototype, "aspekBobot", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasAspect.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KPMRLikuiditasAspect.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpmr_likuiditas_pertanyaan_entity_1.KPMRLikuiditasQuestion, (question) => question.aspect),
    __metadata("design:type", Array)
], KPMRLikuiditasAspect.prototype, "questions", void 0);
exports.KPMRLikuiditasAspect = KPMRLikuiditasAspect = __decorate([
    (0, typeorm_1.Entity)('kpmr_likuiditas_aspek_holding'),
    (0, typeorm_1.Index)('UQ_YEAR_ASPEK_NO_LIKUIDITAS', ['year', 'aspekNo'], { unique: true })
], KPMRLikuiditasAspect);
//# sourceMappingURL=kpmr-likuiditas-aspek.entity.js.map