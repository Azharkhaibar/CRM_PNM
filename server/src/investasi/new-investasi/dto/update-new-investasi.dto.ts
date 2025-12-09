import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestasiDto } from './create-new-investasi.dto';
// import { CreateInvestasiSectionDto } from './create-investasi-section.dto';

export class UpdateInvestasiDto extends PartialType(CreateInvestasiDto) {}

export class UpdateInvestasiSectionDto extends PartialType(
  CreateInvestasiDto,
) {}
