import { PartialType } from '@nestjs/swagger';
import { CreateKpmrOperasionalDto } from './create-kpmr-operasional.dto';

export class UpdateKpmrOperasionalDto extends PartialType(CreateKpmrOperasionalDto) {}
