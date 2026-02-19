"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRasDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ra_dto_1 = require("./create-ra.dto");
class UpdateRasDto extends (0, mapped_types_1.PartialType)(create_ra_dto_1.CreateRasDto) {
}
exports.UpdateRasDto = UpdateRasDto;
//# sourceMappingURL=update-ra.dto.js.map