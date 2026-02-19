import { PartialType } from '@nestjs/swagger';
import { CreateKepatuhanOjkDto } from './create-kepatuhan-ojk.dto';

export class UpdateKepatuhanOjkDto extends PartialType(CreateKepatuhanOjkDto) {}
