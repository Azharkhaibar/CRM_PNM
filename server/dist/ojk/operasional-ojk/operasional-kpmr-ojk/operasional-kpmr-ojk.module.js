"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperasionalKpmrOjkModule = void 0;
const common_1 = require("@nestjs/common");
const operasional_kpmr_ojk_service_1 = require("./operasional-kpmr-ojk.service");
const operasional_kpmr_ojk_controller_1 = require("./operasional-kpmr-ojk.controller");
let OperasionalKpmrOjkModule = class OperasionalKpmrOjkModule {
};
exports.OperasionalKpmrOjkModule = OperasionalKpmrOjkModule;
exports.OperasionalKpmrOjkModule = OperasionalKpmrOjkModule = __decorate([
    (0, common_1.Module)({
        controllers: [operasional_kpmr_ojk_controller_1.OperasionalKpmrOjkController],
        providers: [operasional_kpmr_ojk_service_1.OperasionalKpmrOjkService],
    })
], OperasionalKpmrOjkModule);
//# sourceMappingURL=operasional-kpmr-ojk.module.js.map