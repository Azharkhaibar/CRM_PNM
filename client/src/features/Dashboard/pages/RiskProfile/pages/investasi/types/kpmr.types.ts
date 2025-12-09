interface KpmrInvestasi {
  id_kpmr_investasi?: number;
  year: number;
  quarter: string;
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  sectionNo: string;
  sectionTitle: string;
  sectionSkor: number | '';
  level1: string; // strong
  level2: string; // satisfactory
  level3: string; // fair
  level4: string; // marginal
  level5: string; // unsatisfactory
  evidence: string;
}

