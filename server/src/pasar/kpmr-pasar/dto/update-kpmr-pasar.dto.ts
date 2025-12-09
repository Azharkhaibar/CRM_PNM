import { PartialType } from '@nestjs/mapped-types';
import { CreateKpmrPasarDto } from './create-kpmr-pasar.dto';

export class UpdateKpmrPasarDto extends PartialType(CreateKpmrPasarDto) {}
