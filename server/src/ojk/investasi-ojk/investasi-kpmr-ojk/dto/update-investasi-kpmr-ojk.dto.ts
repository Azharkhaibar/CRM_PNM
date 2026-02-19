import { PartialType } from '@nestjs/swagger';
import { CreateInvestasiKpmrOjkDto } from './create-investasi-kpmr-ojk.dto';

export class UpdateInvestasiKpmrOjkDto extends PartialType(CreateInvestasiKpmrOjkDto) {}
