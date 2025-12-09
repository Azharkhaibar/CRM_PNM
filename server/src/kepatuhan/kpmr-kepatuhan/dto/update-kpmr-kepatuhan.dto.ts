import { PartialType } from '@nestjs/swagger';
import { CreateKpmrKepatuhanDto } from './create-kpmr-kepatuhan.dto';

export class UpdateKpmrKepatuhanDto extends PartialType(CreateKpmrKepatuhanDto) {}
