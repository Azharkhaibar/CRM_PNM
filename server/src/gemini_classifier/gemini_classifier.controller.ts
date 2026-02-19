import { Controller, Post, Body } from '@nestjs/common';
import { GeminiClassifierService } from './gemini_classifier.service';

@Controller('ai')
export class GeminiClassifierController {
  constructor(private readonly geminiService: GeminiClassifierService) {}

  @Post('classify-row')
  async classify(@Body() body: any) {
    /**
     * body dari FE:
     * {
     *   noCell: string,
     *   indikatorCell: string,
     *   row: string[]
     * }
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.geminiService.classifyRow(body);
  }
}
