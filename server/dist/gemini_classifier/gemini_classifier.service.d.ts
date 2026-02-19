export declare class GeminiClassifierService {
    private model;
    constructor();
    classifyRow(payload: {
        noCell?: string;
        indikatorCell?: string;
        row: string[];
    }): Promise<any>;
}
