import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { classifyRowPrompt } from './prompt/classify-row.prompt';

@Injectable()
export class GeminiClassifierService {
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async classifyRow(payload: {
    noCell?: string;
    indikatorCell?: string;
    row: string[];
  }) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const result = await this.model.generateContent(
        classifyRowPrompt(payload),
      );

      const rawText = result.response.text();

      // 🔥 STEP 1: Ambil JSON SAJA (regex)
      const match = rawText.match(/\{[\s\S]*\}/);

      if (!match) {
        console.warn('Gemini returned non-JSON:', rawText);
        return {
          type: 'OTHER',
          confidence: 0.3,
        };
      }

      // 🔥 STEP 2: Parse aman
      const parsed = JSON.parse(match[0]);

      // 🔥 STEP 3: Validasi hasil
      if (!parsed.type || typeof parsed.confidence !== 'number') {
        return {
          type: 'OTHER',
          confidence: 0.3,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsed;
    } catch (err) {
      console.error('Gemini classify error:', err);

      // ⛔ JANGAN throw → FE bakal error
      return {
        type: 'OTHER',
        confidence: 0.1,
      };
    }
  }
}
