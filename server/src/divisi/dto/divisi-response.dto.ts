import { Expose } from 'class-transformer';

export class DivisiResponseDto {
  @Expose()
  divisi_id: number;

  @Expose()
  name: string;
}
