"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = apiResponse;
function apiResponse(data, message = 'Success', success = true) {
    return {
        success,
        message,
        data,
        timestamp: new Date(),
    };
}
//# sourceMappingURL=api-response.global.js.map