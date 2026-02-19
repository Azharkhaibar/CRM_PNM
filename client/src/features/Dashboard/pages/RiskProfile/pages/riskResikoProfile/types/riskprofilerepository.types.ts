// src/types/riskProfileRepository.types.ts
export enum ModuleType {
  KEPATUHAN = 'KEPATUHAN',
  REPUTASI = 'REPUTASI',
  INVESTASI = 'INVESTASI',
  LIKUIDITAS = 'LIKUIDITAS',
  OPERASIONAL = 'OPERASIONAL',
  STRATEGIK = 'STRATEGIK',
  TEKNOLOGI = 'TEKNOLOGI',
  HUKUM = 'HUKUM',
  PASAR = 'PASAR',
}

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

export enum CalculationMode {
  RASIO = 'RASIO',
  NILAI_TUNGGAL = 'NILAI_TUNGGAL',
  TEKS = 'TEKS',
}

// Helper functions
export const getModuleName = (module: ModuleType): string => {
  const moduleNames: Record<ModuleType, string> = {
    [ModuleType.KEPATUHAN]: 'Kepatuhan',
    [ModuleType.REPUTASI]: 'Reputasi',
    [ModuleType.INVESTASI]: 'Investasi',
    [ModuleType.LIKUIDITAS]: 'Likuiditas',
    [ModuleType.OPERASIONAL]: 'Operasional',
    [ModuleType.STRATEGIK]: 'Strategik',
    [ModuleType.TEKNOLOGI]: 'Teknologi',
    [ModuleType.HUKUM]: 'Hukum',
    [ModuleType.PASAR]: 'Pasar',
  };
  return moduleNames[module] || module;
};

export const getModuleColor = (module: ModuleType): string => {
  const moduleColors: Record<ModuleType, string> = {
    [ModuleType.KEPATUHAN]: '#0068B3',
    [ModuleType.REPUTASI]: '#00A3DA',
    [ModuleType.INVESTASI]: '#33C2B5',
    [ModuleType.LIKUIDITAS]: '#FF6B6B',
    [ModuleType.OPERASIONAL]: '#FFA726',
    [ModuleType.STRATEGIK]: '#9C27B0',
    [ModuleType.TEKNOLOGI]: '#4CAF50',
    [ModuleType.HUKUM]: '#607D8B',
    [ModuleType.PASAR]: '#795548',
  };
  return moduleColors[module] || '#6B7280';
};

export const getQuarterLabel = (quarter: Quarter): string => {
  const quarterLabels: Record<Quarter, string> = {
    [Quarter.Q1]: 'Q1 - Januari s/d Maret',
    [Quarter.Q2]: 'Q2 - April s/d Juni',
    [Quarter.Q3]: 'Q3 - Juli s/d September',
    [Quarter.Q4]: 'Q4 - Oktober s/d Desember',
  };
  return quarterLabels[quarter] || quarter;
};
