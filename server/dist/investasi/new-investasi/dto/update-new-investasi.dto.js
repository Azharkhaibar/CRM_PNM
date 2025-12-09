"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvestasiSectionDto = exports.UpdateInvestasiDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_new_investasi_dto_1 = require("./create-new-investasi.dto");
class UpdateInvestasiDto extends (0, mapped_types_1.PartialType)(create_new_investasi_dto_1.CreateInvestasiDto) {
}
exports.UpdateInvestasiDto = UpdateInvestasiDto;
class UpdateInvestasiSectionDto extends (0, mapped_types_1.PartialType)(create_new_investasi_dto_1.CreateInvestasiDto) {
}
exports.UpdateInvestasiSectionDto = UpdateInvestasiSectionDto;
//# sourceMappingURL=update-new-investasi.dto.js.map