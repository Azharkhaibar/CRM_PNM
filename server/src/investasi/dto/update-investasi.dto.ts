import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestasiDto } from './create-investasi.dto';

export class UpdateInvestasiDto extends PartialType(CreateInvestasiDto) {}
