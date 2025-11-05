"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtAuthGuard = createJwtAuthGuard;
const passport_1 = require("@nestjs/passport");
function createJwtAuthGuard() {
    return (0, passport_1.AuthGuard)('jwt');
}
//# sourceMappingURL=create-jwt-auth.guard.js.map