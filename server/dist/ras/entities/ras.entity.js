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
exports.RasData = exports.TindakLanjutStatus = exports.UnitTypeOptions = exports.RiskStanceOptions = void 0;
const typeorm_1 = require("typeorm");
exports.RiskStanceOptions = [
    'Tidak Toleran',
    'Konservatif',
    'Moderat',
    'Strategis',
];
exports.UnitTypeOptions = [
    'PERCENTAGE',
    'RUPIAH',
    'X',
    'REAL',
    'HOUR',
];
var TindakLanjutStatus;
(function (TindakLanjutStatus) {
    TindakLanjutStatus["ON_PROGRESS"] = "On Progress";
    TindakLanjutStatus["DONE"] = "Done";
})(TindakLanjutStatus || (exports.TindakLanjutStatus = TindakLanjutStatus = {}));
let RasData = class RasData {
    id;
    year;
    groupId;
    riskCategory;
    no;
    parameter;
    statement;
    formulasi;
    riskStance;
    unitType;
    dataTypeExplanation;
    notes;
    rkapTarget;
    rasLimit;
    hasNumeratorDenominator;
    numeratorLabel;
    denominatorLabel;
    monthlyValues;
    tindakLanjut;
    createdAt;
    updatedAt;
};
exports.RasData = RasData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RasData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RasData.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RasData.prototype, "riskCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], RasData.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], RasData.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "statement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "formulasi", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'Moderat',
    }),
    __metadata("design:type", String)
], RasData.prototype, "riskStance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'PERCENTAGE',
    }),
    __metadata("design:type", String)
], RasData.prototype, "unitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "dataTypeExplanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "rkapTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "rasLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RasData.prototype, "hasNumeratorDenominator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "numeratorLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RasData.prototype, "denominatorLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], RasData.prototype, "monthlyValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], RasData.prototype, "tindakLanjut", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], RasData.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], RasData.prototype, "updatedAt", void 0);
exports.RasData = RasData = __decorate([
    (0, typeorm_1.Entity)('risk_appetite_statement'),
    (0, typeorm_1.Index)('idx_year', ['year']),
    (0, typeorm_1.Index)('idx_riskCategory', ['riskCategory']),
    (0, typeorm_1.Index)('idx_groupId', ['groupId']),
    (0, typeorm_1.Index)('idx_year_risk', ['year', 'riskCategory'])
], RasData);
//# sourceMappingURL=ras.entity.js.map