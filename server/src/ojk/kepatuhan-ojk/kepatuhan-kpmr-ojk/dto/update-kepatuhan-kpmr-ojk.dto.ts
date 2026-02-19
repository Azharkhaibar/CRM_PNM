import { PartialType } from '@nestjs/swagger';
import { CreateKepatuhanKpmrOjkDto } from './create-kepatuhan-kpmr-ojk.dto';

export class UpdateKepatuhanKpmrOjkDto extends PartialType(CreateKepatuhanKpmrOjkDto) {}
