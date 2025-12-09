"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrOperasionalService = void 0;
const common_1 = require("@nestjs/common");
let KpmrOperasionalService = class KpmrOperasionalService {
    create(createKpmrOperasionalDto) {
        return 'This action adds a new kpmrOperasional';
    }
    findAll() {
        return `This action returns all kpmrOperasional`;
    }
    findOne(id) {
        return `This action returns a #${id} kpmrOperasional`;
    }
    update(id, updateKpmrOperasionalDto) {
        return `This action updates a #${id} kpmrOperasional`;
    }
    remove(id) {
        return `This action removes a #${id} kpmrOperasional`;
    }
};
exports.KpmrOperasionalService = KpmrOperasionalService;
exports.KpmrOperasionalService = KpmrOperasionalService = __decorate([
    (0, common_1.Injectable)()
], KpmrOperasionalService);
//# sourceMappingURL=kpmr-operasional.service.js.map