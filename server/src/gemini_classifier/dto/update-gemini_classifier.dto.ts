import { PartialType } from '@nestjs/swagger';
import { CreateGeminiClassifierDto } from './create-gemini_classifier.dto';

export class UpdateGeminiClassifierDto extends PartialType(CreateGeminiClassifierDto) {}
