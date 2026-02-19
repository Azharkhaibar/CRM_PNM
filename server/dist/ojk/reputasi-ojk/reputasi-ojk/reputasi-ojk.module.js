"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputasiOjkModule = void 0;
const common_1 = require("@nestjs/common");
const reputasi_ojk_service_1 = require("./reputasi-ojk.service");
const reputasi_ojk_controller_1 = require("./reputasi-ojk.controller");
let ReputasiOjkModule = class ReputasiOjkModule {
};
exports.ReputasiOjkModule = ReputasiOjkModule;
exports.ReputasiOjkModule = ReputasiOjkModule = __decorate([
    (0, common_1.Module)({
        controllers: [reputasi_ojk_controller_1.ReputasiOjkController],
        providers: [reputasi_ojk_service_1.ReputasiOjkService],
    })
], ReputasiOjkModule);
//# sourceMappingURL=reputasi-ojk.module.js.map