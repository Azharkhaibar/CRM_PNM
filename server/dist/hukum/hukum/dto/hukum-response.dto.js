"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HukumResponseDto = void 0;
class HukumResponseDto {
    success;
    message;
    data;
    meta;
    constructor(success, message, data, meta) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
    static success(message, data, meta) {
        return new HukumResponseDto(true, message, data, meta);
    }
    static error(message) {
        return new HukumResponseDto(false, message);
    }
}
exports.HukumResponseDto = HukumResponseDto;
//# sourceMappingURL=hukum-response.dto.js.map