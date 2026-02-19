import { PartialType } from '@nestjs/swagger';
import { CreateReputasiOjkDto } from './create-reputasi-ojk.dto';

export class UpdateReputasiOjkDto extends PartialType(CreateReputasiOjkDto) {}
