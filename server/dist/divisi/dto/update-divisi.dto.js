"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDivisiDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_divisi_dto_1 = require("./create-divisi.dto");
class UpdateDivisiDto extends (0, mapped_types_1.PartialType)(create_divisi_dto_1.CreateDivisiDto) {
}
exports.UpdateDivisiDto = UpdateDivisiDto;
//# sourceMappingURL=update-divisi.dto.js.map