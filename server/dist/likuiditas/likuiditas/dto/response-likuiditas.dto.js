"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikuiditasResponseDto = exports.SectionLikuiditasResponseDto = void 0;
class SectionLikuiditasResponseDto {
    id;
    no;
    parameter;
    bobotSection;
    description;
    year;
    quarter;
    createdAt;
    updatedAt;
    indikators;
}
exports.SectionLikuiditasResponseDto = SectionLikuiditasResponseDto;
class LikuiditasResponseDto {
    id;
    year;
    quarter;
    sectionId;
    subNo;
    namaIndikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
    mode;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    formula;
    isPercent;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
    createdAt;
    updatedAt;
    section;
}
exports.LikuiditasResponseDto = LikuiditasResponseDto;
//# sourceMappingURL=response-likuiditas.dto.js.map