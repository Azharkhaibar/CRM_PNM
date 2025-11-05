"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
//# sourceMappingURL=role.decorator.js.map