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
exports.GetLikuiditasDto = void 0;
const class_transformer_1 = require("class-transformer");
class GetLikuiditasDto {
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
}
exports.GetLikuiditasDto = GetLikuiditasDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "bobot", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "parameter", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "no_indikator", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "indikator", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "bobot_indikator", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "sumber_resiko", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "dampak", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "low", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "low_to_moderate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "moderate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "moderate_to_high", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "high", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "hasil", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "peringkat", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "nama_pembilang", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "nama_penyebut", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "nilai_pembilang", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "nilai_penyebut", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "weighted", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetLikuiditasDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetLikuiditasDto.prototype, "pereview_hasil", void 0);
//# sourceMappingURL=get-dto-likuiditas.dto.js.map