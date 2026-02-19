export declare const MODULE_CONFIG: {
    readonly KEPATUHAN: {
        readonly name: "Kepatuhan";
        readonly color: "#0068B3";
        readonly tableName: "indikators_kepatuhan";
        readonly sectionTableName: "sections_kepatuhan";
    };
    readonly REPUTASI: {
        readonly name: "Reputasi";
        readonly color: "#00A3DA";
        readonly tableName: "indikators_reputasi";
        readonly sectionTableName: "sections_reputasi";
    };
    readonly INVESTASI: {
        readonly name: "Investasi";
        readonly color: "#33C2B5";
        readonly tableName: "indikators_investasi";
        readonly sectionTableName: "sections_investasi";
    };
    readonly LIKUIDITAS: {
        readonly name: "Likuiditas";
        readonly color: "#FF6B6B";
        readonly tableName: "indikators_likuiditas";
        readonly sectionTableName: "sections_likuiditas";
    };
    readonly OPERASIONAL: {
        readonly name: "Operasional";
        readonly color: "#FFA726";
        readonly tableName: "indikators_operasional";
        readonly sectionTableName: "sections_operasional";
    };
    readonly STRATEGIS: {
        readonly name: "Strategis";
        readonly color: "#9C27B0";
        readonly tableName: "indikators_strategis";
        readonly sectionTableName: "sections_strategis";
    };
    readonly KEUANGAN: {
        readonly name: "Keuangan";
        readonly color: "#4CAF50";
        readonly tableName: "indikators_keuangan";
        readonly sectionTableName: "sections_keuangan";
    };
    readonly TEKNOLOGI: {
        readonly name: "Teknologi";
        readonly color: "#607D8B";
        readonly tableName: "indikators_teknologi";
        readonly sectionTableName: "sections_teknologi";
    };
};
export type ModuleType = keyof typeof MODULE_CONFIG;
export declare const MODULE_TYPES: ModuleType[];
