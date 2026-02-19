import { PartialType } from '@nestjs/swagger';
import { CreateHukumOjkDto } from './create-hukum-ojk.dto';

export class UpdateHukumOjkDto extends PartialType(CreateHukumOjkDto) {}
