"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperasionalOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const operasional_ojk_controller_1 = require("./operasional-ojk.controller");
const operasional_ojk_entity_1 = require("./entities/operasional-ojk.entity");
const operasional_produk_parameter_entity_1 = require("./entities/operasional-produk-parameter.entity");
const operasional_produk_nilai_entity_1 = require("./entities/operasional-produk-nilai.entity");
const operasional_inherent_references_entity_1 = require("./entities/operasional-inherent-references.entity");
const operasional_ojk_service_1 = require("./operasional-ojk.service");
let OperasionalOjkModule = class OperasionalOjkModule {
};
exports.OperasionalOjkModule = OperasionalOjkModule;
exports.OperasionalOjkModule = OperasionalOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                operasional_ojk_entity_1.Operasional,
                operasional_produk_parameter_entity_1.OperasionalParameter,
                operasional_produk_nilai_entity_1.OperasionalNilai,
                operasional_inherent_references_entity_1.OperasionalReference,
            ]),
        ],
        controllers: [operasional_ojk_controller_1.OperasionalController],
        providers: [operasional_ojk_service_1.OperasionalService],
        exports: [operasional_ojk_service_1.OperasionalService],
    })
], OperasionalOjkModule);
//# sourceMappingURL=operasional-ojk.module.js.map