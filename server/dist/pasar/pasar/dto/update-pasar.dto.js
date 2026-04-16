"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasarDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pasar_dto_1 = require("./create-pasar.dto");
class UpdatePasarDto extends (0, mapped_types_1.PartialType)(create_pasar_dto_1.CreatePasarDto) {
}
exports.UpdatePasarDto = UpdatePasarDto;
//# sourceMappingURL=update-pasar.dto.js.map