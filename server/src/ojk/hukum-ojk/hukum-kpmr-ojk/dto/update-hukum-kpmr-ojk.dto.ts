import { PartialType } from '@nestjs/swagger';
import { CreateHukumKpmrOjkDto } from './create-hukum-kpmr-ojk.dto';

export class UpdateHukumKpmrOjkDto extends PartialType(CreateHukumKpmrOjkDto) {}
