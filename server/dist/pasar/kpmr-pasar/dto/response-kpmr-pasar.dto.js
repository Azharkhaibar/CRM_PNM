"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrPasarResponseDto = void 0;
class KpmrPasarResponseDto {
    success;
    data;
    message;
    constructor(success, data, message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
    static success(data, message) {
        return new KpmrPasarResponseDto(true, data, message);
    }
    static error(message) {
        return new KpmrPasarResponseDto(false, undefined, message);
    }
}
exports.KpmrPasarResponseDto = KpmrPasarResponseDto;
//# sourceMappingURL=response-kpmr-pasar.dto.js.map