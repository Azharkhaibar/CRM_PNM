// src/constants/module.constants.ts
export const MODULE_CONFIG = {
  KEPATUHAN: {
    name: 'Kepatuhan',
    color: '#0068B3',
    tableName: 'indikators_kepatuhan',
    sectionTableName: 'sections_kepatuhan',
  },
  REPUTASI: {
    name: 'Reputasi',
    color: '#00A3DA',
    tableName: 'indikators_reputasi',
    sectionTableName: 'sections_reputasi',
  },
  INVESTASI: {
    name: 'Investasi',
    color: '#33C2B5',
    tableName: 'indikators_investasi',
    sectionTableName: 'sections_investasi',
  },
  LIKUIDITAS: {
    name: 'Likuiditas',
    color: '#FF6B6B',
    tableName: 'indikators_likuiditas',
    sectionTableName: 'sections_likuiditas',
  },
  OPERASIONAL: {
    name: 'Operasional',
    color: '#FFA726',
    tableName: 'indikators_operasional',
    sectionTableName: 'sections_operasional',
  },
  STRATEGIS: {
    name: 'Strategis',
    color: '#9C27B0',
    tableName: 'indikators_strategis',
    sectionTableName: 'sections_strategis',
  },
  KEUANGAN: {
    name: 'Keuangan',
    color: '#4CAF50',
    tableName: 'indikators_keuangan',
    sectionTableName: 'sections_keuangan',
  },
  TEKNOLOGI: {
    name: 'Teknologi',
    color: '#607D8B',
    tableName: 'indikators_teknologi',
    sectionTableName: 'sections_teknologi',
  },
} as const;

export type ModuleType = keyof typeof MODULE_CONFIG;

export const MODULE_TYPES = Object.keys(MODULE_CONFIG) as ModuleType[];