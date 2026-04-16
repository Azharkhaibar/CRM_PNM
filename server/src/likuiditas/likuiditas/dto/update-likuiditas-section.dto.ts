import { PartialType } from '@nestjs/swagger';
import { CreateLikuiditasSectionDto } from './create-likuiditas-section.dto';

export class UpdateLikuiditasSectionDto extends PartialType(
  CreateLikuiditasSectionDto,
) {}
