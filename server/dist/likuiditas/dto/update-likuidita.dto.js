"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLikuiditasDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_likuidita_dto_1 = require("./create-likuidita.dto");
class UpdateLikuiditasDto extends (0, mapped_types_1.PartialType)(create_likuidita_dto_1.CreateLikuiditasDto) {
}
exports.UpdateLikuiditasDto = UpdateLikuiditasDto;
//# sourceMappingURL=update-likuidita.dto.js.map