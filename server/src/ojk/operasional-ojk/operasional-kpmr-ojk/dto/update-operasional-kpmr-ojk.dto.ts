import { PartialType } from '@nestjs/swagger';
import { CreateOperasionalKpmrOjkDto } from './create-operasional-kpmr-ojk.dto';

export class UpdateOperasionalKpmrOjkDto extends PartialType(CreateOperasionalKpmrOjkDto) {}
