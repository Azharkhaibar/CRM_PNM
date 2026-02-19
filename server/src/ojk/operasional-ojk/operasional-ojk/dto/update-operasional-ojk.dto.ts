import { PartialType } from '@nestjs/swagger';
import { CreateOperasionalOjkDto } from './create-operasional-ojk.dto';

export class UpdateOperasionalOjkDto extends PartialType(
  CreateOperasionalOjkDto,
) {}
