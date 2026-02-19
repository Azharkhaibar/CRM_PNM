import { PartialType } from '@nestjs/swagger';
import { CreateReputasiKpmrOjkDto } from './create-reputasi-kpmr-ojk.dto';

export class UpdateReputasiKpmrOjkDto extends PartialType(CreateReputasiKpmrOjkDto) {}
