import { PartialType } from '@nestjs/swagger';
import { CreateKpmrHukumDto } from './create-kpmr-hukum.dto';

export class UpdateKpmrHukumDto extends PartialType(CreateKpmrHukumDto) {}
