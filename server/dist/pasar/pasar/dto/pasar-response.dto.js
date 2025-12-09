"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardSummaryResponseDto = exports.SectionWithIndikatorsResponseDto = exports.IndikatorResponseDto = exports.SectionResponseDto = exports.IndikatorMode = exports.Triwulan = void 0;
var Triwulan;
(function (Triwulan) {
    Triwulan["Q1"] = "Q1";
    Triwulan["Q2"] = "Q2";
    Triwulan["Q3"] = "Q3";
    Triwulan["Q4"] = "Q4";
})(Triwulan || (exports.Triwulan = Triwulan = {}));
var IndikatorMode;
(function (IndikatorMode) {
    IndikatorMode["RASIO"] = "RASIO";
    IndikatorMode["NILAI_TUNGGAL"] = "NILAI_TUNGGAL";
})(IndikatorMode || (exports.IndikatorMode = IndikatorMode = {}));
class SectionResponseDto {
    id;
    no_sec;
    nama_section;
    bobot_par;
    tahun;
    triwulan;
    total_weighted;
    created_at;
    updated_at;
}
exports.SectionResponseDto = SectionResponseDto;
class IndikatorResponseDto {
    id;
    sectionId;
    nama_indikator;
    bobot_indikator;
    pembilang_label;
    pembilang_value;
    penyebut_label;
    penyebut_value;
    sumber_risiko;
    dampak;
    low;
    low_to_moderate;
    moderate;
    moderate_to_high;
    high;
    hasil;
    peringkat;
    weighted;
    keterangan;
    mode;
    formula;
    is_percent;
    created_at;
    updated_at;
}
exports.IndikatorResponseDto = IndikatorResponseDto;
class SectionWithIndikatorsResponseDto {
    id;
    no_sec;
    nama_section;
    bobot_par;
    tahun;
    triwulan;
    total_weighted;
    created_at;
    updated_at;
    indikators;
}
exports.SectionWithIndikatorsResponseDto = SectionWithIndikatorsResponseDto;
class DashboardSummaryResponseDto {
    tahun;
    triwulan;
    total_sections;
    total_indicators;
    total_weighted;
    average_hasil;
    average_hasil_percent;
}
exports.DashboardSummaryResponseDto = DashboardSummaryResponseDto;
//# sourceMappingURL=pasar-response.dto.js.map