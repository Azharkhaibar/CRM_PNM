"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategisOjkModule = void 0;
const common_1 = require("@nestjs/common");
const strategis_ojk_service_1 = require("./strategis-ojk.service");
const strategis_ojk_controller_1 = require("./strategis-ojk.controller");
let StrategisOjkModule = class StrategisOjkModule {
};
exports.StrategisOjkModule = StrategisOjkModule;
exports.StrategisOjkModule = StrategisOjkModule = __decorate([
    (0, common_1.Module)({
        controllers: [strategis_ojk_controller_1.StrategisOjkController],
        providers: [strategis_ojk_service_1.StrategisOjkService],
    })
], StrategisOjkModule);
//# sourceMappingURL=strategis-ojk.module.js.map