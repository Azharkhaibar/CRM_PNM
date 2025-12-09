"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHukumDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_hukum_dto_1 = require("./create-hukum.dto");
class UpdateHukumDto extends (0, mapped_types_1.PartialType)(create_hukum_dto_1.CreateHukumDto) {
}
exports.UpdateHukumDto = UpdateHukumDto;
//# sourceMappingURL=update-hukum.dto.js.map