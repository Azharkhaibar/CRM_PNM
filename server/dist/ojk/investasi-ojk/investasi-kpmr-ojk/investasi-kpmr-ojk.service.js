"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestasiKpmrOjkService = void 0;
const common_1 = require("@nestjs/common");
let InvestasiKpmrOjkService = class InvestasiKpmrOjkService {
    create(createInvestasiKpmrOjkDto) {
        return 'This action adds a new investasiKpmrOjk';
    }
    findAll() {
        return `This action returns all investasiKpmrOjk`;
    }
    findOne(id) {
        return `This action returns a #${id} investasiKpmrOjk`;
    }
    update(id, updateInvestasiKpmrOjkDto) {
        return `This action updates a #${id} investasiKpmrOjk`;
    }
    remove(id) {
        return `This action removes a #${id} investasiKpmrOjk`;
    }
};
exports.InvestasiKpmrOjkService = InvestasiKpmrOjkService;
exports.InvestasiKpmrOjkService = InvestasiKpmrOjkService = __decorate([
    (0, common_1.Injectable)()
], InvestasiKpmrOjkService);
//# sourceMappingURL=investasi-kpmr-ojk.service.js.map