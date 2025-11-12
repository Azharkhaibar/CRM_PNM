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
exports.KpmrInvestasi = void 0;
const typeorm_1 = require("typeorm");
let KpmrInvestasi = class KpmrInvestasi {
    id_kpmr_investasi;
    year;
    quarter;
    aspekNo;
    aspekBobot;
    aspekTitle;
    sectionNo;
    indikator;
    sectionSkor;
    tata_kelola_resiko;
    strong;
    satisfactory;
    fair;
    marginal;
    unsatisfactory;
    evidence;
};
exports.KpmrInvestasi = KpmrInvestasi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KpmrInvestasi.prototype, "id_kpmr_investasi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], KpmrInvestasi.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, name: 'aspek_no' }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "aspekNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true, name: 'aspek_bobot' }),
    __metadata("design:type", Number)
], KpmrInvestasi.prototype, "aspekBobot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'aspek_title' }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "aspekTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, name: 'section_no' }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "sectionNo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
        length: 255,
        name: 'indikator',
    }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true, name: 'section_skor' }),
    __metadata("design:type", Number)
], KpmrInvestasi.prototype, "sectionSkor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "tata_kelola_resiko", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "strong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "satisfactory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "fair", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "marginal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "unsatisfactory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], KpmrInvestasi.prototype, "evidence", void 0);
exports.KpmrInvestasi = KpmrInvestasi = __decorate([
    (0, typeorm_1.Entity)('kpmr_investasi')
], KpmrInvestasi);
//# sourceMappingURL=kpmr-investasi.entity.js.map