import { PartialType } from '@nestjs/mapped-types';
import { CreateKpmrInvestasiDto } from './create-kpmr-investasi.dto';

export class UpdateKpmrInvestasiDto extends PartialType(
  CreateKpmrInvestasiDto,
) {}
