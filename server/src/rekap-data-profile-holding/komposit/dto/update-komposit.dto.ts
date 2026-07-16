import { PartialType } from '@nestjs/swagger';
import { CreateKompositDto } from './create-komposit.dto';

export class UpdateKompositDto extends PartialType(CreateKompositDto) {}
