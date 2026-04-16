"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KepatuhanOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kepatuhan_ojk_service_1 = require("./kepatuhan-ojk.service");
const kepatuhan_ojk_controller_1 = require("./kepatuhan-ojk.controller");
const kepatuhan_ojk_entity_1 = require("./entities/kepatuhan-ojk.entity");
const kepatuhan_paramater_entity_1 = require("./entities/kepatuhan-paramater.entity");
const kepatuhan_nilai_entity_1 = require("./entities/kepatuhan-nilai.entity");
const kepatuhan_inherent_references_entity_1 = require("./entities/kepatuhan-inherent-references.entity");
let KepatuhanOjkModule = class KepatuhanOjkModule {
};
exports.KepatuhanOjkModule = KepatuhanOjkModule;
exports.KepatuhanOjkModule = KepatuhanOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                kepatuhan_ojk_entity_1.KepatuhanOjk,
                kepatuhan_paramater_entity_1.KepatuhanParameter,
                kepatuhan_nilai_entity_1.KepatuhanNilai,
                kepatuhan_inherent_references_entity_1.KepatuhanReference,
            ]),
        ],
        controllers: [kepatuhan_ojk_controller_1.KepatuhanOjkController],
        providers: [kepatuhan_ojk_service_1.KepatuhanOjkService],
        exports: [kepatuhan_ojk_service_1.KepatuhanOjkService],
    })
], KepatuhanOjkModule);
//# sourceMappingURL=kepatuhan-ojk.module.js.map