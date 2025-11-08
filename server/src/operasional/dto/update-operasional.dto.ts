import { PartialType } from '@nestjs/swagger';
import { CreateOperasionalDto } from './create-operasional.dto';

export class UpdateOperasionalDto extends PartialType(CreateOperasionalDto) {}
