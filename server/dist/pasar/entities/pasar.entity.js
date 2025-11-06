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
exports.Pasar = void 0;
const typeorm_1 = require("typeorm");
let Pasar = class Pasar {
    id;
    bobot;
    parameter;
    no_indikator;
    indikator;
    bobot_indikator;
    sumber_resiko;
    dampak;
    low;
    low_to_moderate;
    moderate;
    moderate_to_high;
    high;
    hasil;
    peringkat;
    nama_pembilang;
    nama_penyebut;
    nilai_pembilang;
    nilai_penyebut;
    weighted;
    keterangan;
    pereview_hasil;
};
exports.Pasar = Pasar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pasar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Pasar.prototype, "bobot", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Pasar.prototype, "no_indikator", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Pasar.prototype, "bobot_indikator", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "sumber_resiko", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "low_to_moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "moderate_to_high", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Pasar.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Pasar.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pasar.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pasar.prototype, "nama_pembilang", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pasar.prototype, "nama_penyebut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pasar.prototype, "nilai_pembilang", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pasar.prototype, "nilai_penyebut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pasar.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Pasar.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pasar.prototype, "pereview_hasil", void 0);
exports.Pasar = Pasar = __decorate([
    (0, typeorm_1.Entity)('pasar')
], Pasar);
//# sourceMappingURL=pasar.entity.js.map