import { GeminiClassifierService } from './gemini_classifier.service';
export declare class GeminiClassifierController {
    private readonly geminiService;
    constructor(geminiService: GeminiClassifierService);
    classify(body: any): Promise<any>;
}
