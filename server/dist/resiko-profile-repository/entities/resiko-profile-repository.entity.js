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
exports.RiskProfileRepositoryView = exports.Quarter = exports.CalculationMode = exports.ModuleType = void 0;
const typeorm_1 = require("typeorm");
var ModuleType;
(function (ModuleType) {
    ModuleType["KEPATUHAN"] = "KEPATUHAN";
    ModuleType["REPUTASI"] = "REPUTASI";
    ModuleType["INVESTASI"] = "INVESTASI";
    ModuleType["LIKUIDITAS"] = "LIKUIDITAS";
    ModuleType["OPERASIONAL"] = "OPERASIONAL";
    ModuleType["STRATEGIK"] = "STRATEGIK";
    ModuleType["HUKUM"] = "HUKUM";
    ModuleType["PASAR"] = "PASAR";
})(ModuleType || (exports.ModuleType = ModuleType = {}));
var CalculationMode;
(function (CalculationMode) {
    CalculationMode["RASIO"] = "RASIO";
    CalculationMode["NILAI_TUNGGAL"] = "NILAI_TUNGGAL";
    CalculationMode["TEKS"] = "TEKS";
})(CalculationMode || (exports.CalculationMode = CalculationMode = {}));
var Quarter;
(function (Quarter) {
    Quarter["Q1"] = "Q1";
    Quarter["Q2"] = "Q2";
    Quarter["Q3"] = "Q3";
    Quarter["Q4"] = "Q4";
})(Quarter || (exports.Quarter = Quarter = {}));
let RiskProfileRepositoryView = class RiskProfileRepositoryView {
    moduleType;
    id;
    year;
    quarter;
    sectionId;
    no;
    sectionLabel;
    bobotSection;
    parameter;
    sectionDescription;
    subNo;
    indikator;
    bobotIndikator;
    sumberRisiko;
    dampak;
    low;
    lowToModerate;
    moderate;
    moderateToHigh;
    high;
    mode;
    formula;
    isPercent;
    pembilangLabel;
    pembilangValue;
    penyebutLabel;
    penyebutValue;
    hasil;
    hasilText;
    peringkat;
    weighted;
    keterangan;
    isValidated;
    createdAt;
    updatedAt;
};
exports.RiskProfileRepositoryView = RiskProfileRepositoryView;
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "moduleType", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "sectionId", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "no", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'sectionLabel' }),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "sectionLabel", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'bobotSection' }),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "bobotSection", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'sectionDescription' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "sectionDescription", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'subNo' }),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "subNo", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "indikator", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'bobotIndikator' }),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "bobotIndikator", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'sumberRisiko' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "sumberRisiko", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "dampak", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'lowToModerate' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "lowToModerate", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "moderate", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'moderateToHigh' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "moderateToHigh", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", String)
], RiskProfileRepositoryView.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "formula", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'isPercent' }),
    __metadata("design:type", Boolean)
], RiskProfileRepositoryView.prototype, "isPercent", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'pembilangLabel' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "pembilangLabel", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'pembilangValue' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "pembilangValue", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'penyebutLabel' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "penyebutLabel", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'penyebutValue' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "penyebutValue", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'hasilText' }),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "hasilText", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "peringkat", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Number)
], RiskProfileRepositoryView.prototype, "weighted", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)(),
    __metadata("design:type", Object)
], RiskProfileRepositoryView.prototype, "keterangan", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'isValidated' }),
    __metadata("design:type", Boolean)
], RiskProfileRepositoryView.prototype, "isValidated", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], RiskProfileRepositoryView.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ViewColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], RiskProfileRepositoryView.prototype, "updatedAt", void 0);
exports.RiskProfileRepositoryView = RiskProfileRepositoryView = __decorate([
    (0, typeorm_1.ViewEntity)({
        name: 'risk_profile_repository_view',
        expression: `
    -- KEPATUHAN (SUDAH DIPERBAIKI)
    SELECT 
      'KEPATUHAN' AS "moduleType",
      k.id,
      k.year,
      k.quarter,
      k.section_id AS "sectionId",
      k.no,
      k.section_label AS "sectionLabel",
      k.bobot_section AS "bobotSection",
      k.sub_no AS "subNo",
      k.indikator,
      k.bobot_indikator AS "bobotIndikator",
      k.sumber_risiko AS "sumberRisiko",
      k.dampak,
      k.low,
      k.low_to_moderate AS "lowToModerate",
      k.moderate,
      k.moderate_to_high AS "moderateToHigh",
      k.high,
      k.mode,
      k.formula,
      k.is_percent AS "isPercent",
      k.pembilang_label AS "pembilangLabel",
      k.pembilang_value AS "pembilangValue",
      k.penyebut_label AS "penyebutLabel",
      k.penyebut_value AS "penyebutValue",
      k.hasil,
      k.hasil_text AS "hasilText",
      k.peringkat,
      k.weighted,
      k.keterangan,
      k.is_validated AS "isValidated",
      k.created_at AS "createdAt",
      k.updated_at AS "updatedAt",
      ks.parameter AS "parameter",
      ks.description AS "sectionDescription"
    FROM indikators_kepatuhan k
    LEFT JOIN sections_kepatuhan ks ON k.section_id = ks.id
    
    UNION ALL

    -- REPUTASI (SUDAH DIPERBAIKI)
    SELECT 
      'REPUTASI' AS "moduleType",
      r.id,
      r.year,
      r.quarter,
      r.section_id AS "sectionId",
      r.no,
      r.section_label AS "sectionLabel",
      r.bobot_section AS "bobotSection",
      r.sub_no AS "subNo",
      r.indikator,
      r.bobot_indikator AS "bobotIndikator",
      r.sumber_risiko AS "sumberRisiko",
      r.dampak,
      r.low,
      r.low_to_moderate AS "lowToModerate",
      r.moderate,
      r.moderate_to_high AS "moderateToHigh",
      r.high,
      r.mode,
      r.formula,
      r.is_percent AS "isPercent",
      r.pembilang_label AS "pembilangLabel",
      r.pembilang_value AS "pembilangValue",
      r.penyebut_label AS "penyebutLabel",
      r.penyebut_value AS "penyebutValue",
      r.hasil,
      r.hasil_text AS "hasilText",
      r.peringkat,
      r.weighted,
      r.keterangan,
      r.is_validated AS "isValidated",
      r.created_at AS "createdAt",
      r.updated_at AS "updatedAt",
      rs.parameter AS "parameter",
      rs.description AS "sectionDescription"
    FROM indikators_reputasi r
    LEFT JOIN sections_reputasi rs ON r.section_id = rs.id
    
    UNION ALL
    
    -- INVESTASI (SUDAH DIPERBAIKI)
    SELECT 
      'INVESTASI' AS "moduleType",
      i.id,
      i.year,
      i.quarter,
      i.section_id AS "sectionId",
      i.no,
      i.section_label AS "sectionLabel",
      i.bobot_section AS "bobotSection",
      i.sub_no AS "subNo",
      i.indikator,
      i.bobot_indikator AS "bobotIndikator",
      i.sumber_risiko AS "sumberRisiko",
      i.dampak,
      i.low,
      i.low_to_moderate AS "lowToModerate",
      i.moderate,
      i.moderate_to_high AS "moderateToHigh",
      i.high,
      i.mode,
      i.formula,
      i.is_percent AS "isPercent",
      i.pembilang_label AS "pembilangLabel",
      i.pembilang_value AS "pembilangValue",
      i.penyebut_label AS "penyebutLabel",
      i.penyebut_value AS "penyebutValue",
      i.hasil,
      i.hasil_text AS "hasilText",
      i.peringkat,
      i.weighted,
      i.keterangan,
      i.is_validated AS "isValidated",
      i.created_at AS "createdAt",
      i.updated_at AS "updatedAt",
      isec.parameter AS "parameter",
      isec.description AS "sectionDescription"
    FROM indikators_investasi i
    LEFT JOIN sections_investasi isec ON i.section_id = isec.id
    
    UNION ALL
    
    -- LIKUIDITAS (SUDAH DIPERBAIKI)
    SELECT 
      'LIKUIDITAS' AS "moduleType",
      l.id,
      l.year,
      l.quarter,
      l.section_id AS "sectionId",
      l.no,
      l.section_label AS "sectionLabel",
      l.bobot_section AS "bobotSection",
      l.sub_no AS "subNo",
      l.indikator,
      l.bobot_indikator AS "bobotIndikator",
      l.sumber_risiko AS "sumberRisiko",
      l.dampak,
      l.low,
      l.low_to_moderate AS "lowToModerate",
      l.moderate,
      l.moderate_to_high AS "moderateToHigh",
      l.high,
      l.mode,
      l.formula,
      l.is_percent AS "isPercent",
      l.pembilang_label AS "pembilangLabel",
      l.pembilang_value AS "pembilangValue",
      l.penyebut_label AS "penyebutLabel",
      l.penyebut_value AS "penyebutValue",
      l.hasil,
      l.hasil_text AS "hasilText",
      l.peringkat,
      l.weighted,
      l.keterangan,
      l.is_validated AS "isValidated",
      l.created_at AS "createdAt",
      l.updated_at AS "updatedAt",
      ls.parameter AS "parameter",
      ls.description AS "sectionDescription"
    FROM indikators_likuiditas l
    LEFT JOIN sections_likuiditas ls ON l.section_id = ls.id
    
    UNION ALL
    
    -- OPERASIONAL (SUDAH DIPERBAIKI)
    SELECT 
      'OPERASIONAL' AS "moduleType",
      o.id,
      o.year,
      o.quarter,
      o.section_id AS "sectionId",
      o.no,
      o.section_label AS "sectionLabel",
      o.bobot_section AS "bobotSection",
      o.sub_no AS "subNo",
      o.indikator,
      o.bobot_indikator AS "bobotIndikator",
      o.sumber_risiko AS "sumberRisiko",
      o.dampak,
      o.low,
      o.low_to_moderate AS "lowToModerate",
      o.moderate,
      o.moderate_to_high AS "moderateToHigh",
      o.high,
      o.mode,
      o.formula,
      o.is_percent AS "isPercent",
      o.pembilang_label AS "pembilangLabel",
      o.pembilang_value AS "pembilangValue",
      o.penyebut_label AS "penyebutLabel",
      o.penyebut_value AS "penyebutValue",
      o.hasil,
      o.hasil_text AS "hasilText",
      o.peringkat,
      o.weighted,
      o.keterangan,
      o.is_validated AS "isValidated",
      o.created_at AS "createdAt",
      o.updated_at AS "updatedAt",
      os.parameter AS "parameter",
      os.description AS "sectionDescription"
    FROM indikators_operasional o
    LEFT JOIN sections_operasional os ON o.section_id = os.id
    
    UNION ALL
    
    -- STRATEGIK (SUDAH DIPERBAIKI)
    SELECT 
      'STRATEGIK' AS "moduleType",
      s.id,
      s.year,
      s.quarter,
      s.section_id AS "sectionId",
      s.no,
      s.section_label AS "sectionLabel",
      s.bobot_section AS "bobotSection",
      s.sub_no AS "subNo",
      s.indikator,
      s.bobot_indikator AS "bobotIndikator",
      s.sumber_risiko AS "sumberRisiko",
      s.dampak,
      s.low,
      s.low_to_moderate AS "lowToModerate",
      s.moderate,
      s.moderate_to_high AS "moderateToHigh",
      s.high,
      s.mode,
      s.formula,
      s.is_percent AS "isPercent",
      s.pembilang_label AS "pembilangLabel",
      s.pembilang_value AS "pembilangValue",
      s.penyebut_label AS "penyebutLabel",
      s.penyebut_value AS "penyebutValue",
      s.hasil,
      s.hasil_text AS "hasilText",
      s.peringkat,
      s.weighted,
      s.keterangan,
      s.is_validated AS "isValidated",
      s.created_at AS "createdAt",
      s.updated_at AS "updatedAt",
      ss.parameter AS "parameter",
      ss.description AS "sectionDescription"
    FROM indikators_strategik s
    LEFT JOIN sections_strategik ss ON s.section_id = ss.id
    
    UNION ALL
    
    -- HUKUM (SUDAH DIPERBAIKI)
    SELECT 
      'HUKUM' AS "moduleType",
      h.id,
      h.year,
      h.quarter,
      h.section_id AS "sectionId",
      h.no,
      h.section_label AS "sectionLabel",
      h.bobot_section AS "bobotSection",
      h.sub_no AS "subNo",
      h.indikator,
      h.bobot_indikator AS "bobotIndikator",
      h.sumber_risiko AS "sumberRisiko",
      h.dampak,
      h.low,
      h.low_to_moderate AS "lowToModerate",
      h.moderate,
      h.moderate_to_high AS "moderateToHigh",
      h.high,
      h.mode,
      h.formula,
      h.is_percent AS "isPercent",
      h.pembilang_label AS "pembilangLabel",
      h.pembilang_value AS "pembilangValue",
      h.penyebut_label AS "penyebutLabel",
      h.penyebut_value AS "penyebutValue",
      h.hasil,
      h.hasil_text AS "hasilText",
      h.peringkat,
      h.weighted,
      h.keterangan,
      h.is_validated AS "isValidated",
      h.created_at AS "createdAt",
      h.updated_at AS "updatedAt",
      hs.parameter AS "parameter",
      hs.description AS "sectionDescription"
    FROM indikators_hukum h
    LEFT JOIN sections_hukum hs ON h.section_id = hs.id
    
    UNION ALL
    
    -- PASAR (SUDAH DIPERBAIKI)
    SELECT 
      'PASAR' AS "moduleType",
      p.id,
      p.year,
      p.quarter,
      p.section_id AS "sectionId",
      p.no,
      p.section_label AS "sectionLabel",
      p.bobot_section AS "bobotSection",
      p.sub_no AS "subNo",
      p.indikator,
      p.bobot_indikator AS "bobotIndikator",
      p.sumber_risiko AS "sumberRisiko",
      p.dampak,
      p.low,
      p.low_to_moderate AS "lowToModerate",
      p.moderate,
      p.moderate_to_high AS "moderateToHigh",
      p.high,
      p.mode,
      p.formula,
      p.is_percent AS "isPercent",
      p.pembilang_label AS "pembilangLabel",
      p.pembilang_value AS "pembilangValue",
      p.penyebut_label AS "penyebutLabel",
      p.penyebut_value AS "penyebutValue",
      p.hasil,
      p.hasil_text AS "hasilText",
      p.peringkat,
      p.weighted,
      p.keterangan,
      p.is_validated AS "isValidated",
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt",
      ps.parameter AS "parameter",
      ps.description AS "sectionDescription"
    FROM indikators_pasar p
    LEFT JOIN sections_pasar ps ON p.section_id = ps.id
  `,
    }),
    (0, typeorm_1.Index)('IDX_REPOSITORY_MODULE', ['moduleType']),
    (0, typeorm_1.Index)('IDX_REPOSITORY_PERIOD', ['year', 'quarter']),
    (0, typeorm_1.Index)('IDX_REPOSITORY_YEAR_QUARTER_MODULE', ['year', 'quarter', 'moduleType'])
], RiskProfileRepositoryView);
//# sourceMappingURL=resiko-profile-repository.entity.js.map