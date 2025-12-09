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
exports.KpmrLikuiditas = void 0;
const typeorm_1 = require("typeorm");
let KpmrLikuiditas = class KpmrLikuiditas {
    id_kpmr_likuiditas;
    year;
    quarter;
    aspekNo;
    aspekBobot;
    aspekTitle;
    sectionNo;
    indikator;
    sectionSkor;
    strong;
    satisfactory;
    fair;
    marginal;
    unsatisfactory;
    evidence;
    created_at;
    updated_at;
};
exports.KpmrLikuiditas = KpmrLikuiditas;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrLikuiditas.prototype, "id_kpmr_likuiditas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KpmrLikuiditas.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, name: 'aspek_no' }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "aspekNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true, name: 'aspek_bobot' }),
    __metadata("design:type", Number)
], KpmrLikuiditas.prototype, "aspekBobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'aspek_title' }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "aspekTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, name: 'section_no' }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "sectionNo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
        length: 255,
        name: 'indikator',
    }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true, name: 'section_skor' }),
    __metadata("design:type", Number)
], KpmrLikuiditas.prototype, "sectionSkor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "strong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "satisfactory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "fair", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "marginal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "unsatisfactory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KpmrLikuiditas.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KpmrLikuiditas.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], KpmrLikuiditas.prototype, "updated_at", void 0);
exports.KpmrLikuiditas = KpmrLikuiditas = __decorate([
    (0, typeorm_1.Entity)('kpmr_likuiditas')
], KpmrLikuiditas);
//# sourceMappingURL=kpmr-likuidita.entity.js.map