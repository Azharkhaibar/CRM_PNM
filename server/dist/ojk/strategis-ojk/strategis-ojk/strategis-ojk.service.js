"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategisOjkService = void 0;
const common_1 = require("@nestjs/common");
let StrategisOjkService = class StrategisOjkService {
    create(createStrategisOjkDto) {
        return 'This action adds a new strategisOjk';
    }
    findAll() {
        return `This action returns all strategisOjk`;
    }
    findOne(id) {
        return `This action returns a #${id} strategisOjk`;
    }
    update(id, updateStrategisOjkDto) {
        return `This action updates a #${id} strategisOjk`;
    }
    remove(id) {
        return `This action removes a #${id} strategisOjk`;
    }
};
exports.StrategisOjkService = StrategisOjkService;
exports.StrategisOjkService = StrategisOjkService = __decorate([
    (0, common_1.Injectable)()
], StrategisOjkService);
//# sourceMappingURL=strategis-ojk.service.js.map