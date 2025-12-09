// src/kpmr-pasar/dto/response-kpmr-pasar.dto.ts
export class KpmrPasarResponseDto<T = any> {
  constructor(
    public success: boolean,
    public data?: T,
    public message?: string,
  ) {}

  static success<T>(data: T, message?: string): KpmrPasarResponseDto<T> {
    return new KpmrPasarResponseDto(true, data, message);
  }

  static error(message: string): KpmrPasarResponseDto {
    return new KpmrPasarResponseDto(false, undefined, message);
  }
}
