import { PartialType } from '@nestjs/swagger';
// import { CreateResikoProfileRepositoryDto } from './create-resiko-profile-repository.dto';
import { CreateResikoProfileRepositoryDto } from './create-resiko-profile-repository.dto';
export class UpdateResikoProfileRepositoryDto extends PartialType(
  CreateResikoProfileRepositoryDto,
) {}
