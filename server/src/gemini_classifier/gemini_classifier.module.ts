import { Module } from '@nestjs/common';
import { GeminiClassifierService } from './gemini_classifier.service';
import { GeminiClassifierController } from './gemini_classifier.controller';

@Module({
  controllers: [GeminiClassifierController],
  providers: [GeminiClassifierService],
  exports: [GeminiClassifierService],
})
export class GeminiClassifierModule {}
