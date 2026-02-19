"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiClassifierModule = void 0;
const common_1 = require("@nestjs/common");
const gemini_classifier_service_1 = require("./gemini_classifier.service");
const gemini_classifier_controller_1 = require("./gemini_classifier.controller");
let GeminiClassifierModule = class GeminiClassifierModule {
};
exports.GeminiClassifierModule = GeminiClassifierModule;
exports.GeminiClassifierModule = GeminiClassifierModule = __decorate([
    (0, common_1.Module)({
        controllers: [gemini_classifier_controller_1.GeminiClassifierController],
        providers: [gemini_classifier_service_1.GeminiClassifierService],
        exports: [gemini_classifier_service_1.GeminiClassifierService],
    })
], GeminiClassifierModule);
//# sourceMappingURL=gemini_classifier.module.js.map