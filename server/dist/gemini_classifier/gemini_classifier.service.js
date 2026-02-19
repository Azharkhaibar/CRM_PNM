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
exports.GeminiClassifierService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const classify_row_prompt_1 = require("./prompt/classify-row.prompt");
let GeminiClassifierService = class GeminiClassifierService {
    model;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new common_1.InternalServerErrorException('GEMINI_API_KEY is not defined');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });
    }
    async classifyRow(payload) {
        try {
            const result = await this.model.generateContent((0, classify_row_prompt_1.classifyRowPrompt)(payload));
            const rawText = result.response.text();
            const match = rawText.match(/\{[\s\S]*\}/);
            if (!match) {
                console.warn('Gemini returned non-JSON:', rawText);
                return {
                    type: 'OTHER',
                    confidence: 0.3,
                };
            }
            const parsed = JSON.parse(match[0]);
            if (!parsed.type || typeof parsed.confidence !== 'number') {
                return {
                    type: 'OTHER',
                    confidence: 0.3,
                };
            }
            return parsed;
        }
        catch (err) {
            console.error('Gemini classify error:', err);
            return {
                type: 'OTHER',
                confidence: 0.1,
            };
        }
    }
};
exports.GeminiClassifierService = GeminiClassifierService;
exports.GeminiClassifierService = GeminiClassifierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GeminiClassifierService);
//# sourceMappingURL=gemini_classifier.service.js.map