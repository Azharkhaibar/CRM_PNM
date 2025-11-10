"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((property, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user || typeof request.user !== 'object') {
        throw new common_1.UnauthorizedException('Invalid user authentication');
    }
    const user = request.user;
    if (!user.user_id || !user.userID) {
        throw new common_1.UnauthorizedException('User object missing required properties');
    }
    if (property) {
        const value = user[property];
        if (value === undefined) {
            throw new common_1.UnauthorizedException(`User property '${String(property)}' not found`);
        }
        return value;
    }
    return user;
});
//# sourceMappingURL=get-user.decorator.js.map