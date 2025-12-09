"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrKepatuhanController = void 0;
const common_1 = require("@nestjs/common");
const kpmr_kepatuhan_service_1 = require("./kpmr-kepatuhan.service");
const create_kpmr_kepatuhan_dto_1 = require("./dto/create-kpmr-kepatuhan.dto");
const update_kpmr_kepatuhan_dto_1 = require("./dto/update-kpmr-kepatuhan.dto");
let KpmrKepatuhanController = class KpmrKepatuhanController {
    kpmrKepatuhanService;
    constructor(kpmrKepatuhanService) {
        this.kpmrKepatuhanService = kpmrKepatuhanService;
    }
    create(createKpmrKepatuhanDto) {
        return this.kpmrKepatuhanService.create(createKpmrKepatuhanDto);
    }
    findAll() {
        return this.kpmrKepatuhanService.findAll();
    }
    findOne(id) {
        return this.kpmrKepatuhanService.findOne(+id);
    }
    update(id, updateKpmrKepatuhanDto) {
        return this.kpmrKepatuhanService.update(+id, updateKpmrKepatuhanDto);
    }
    remove(id) {
        return this.kpmrKepatuhanService.remove(+id);
    }
};
exports.KpmrKepatuhanController = KpmrKepatuhanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpmr_kepatuhan_dto_1.CreateKpmrKepatuhanDto]),
    __metadata("design:returntype", void 0)
], KpmrKepatuhanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KpmrKepatuhanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KpmrKepatuhanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kpmr_kepatuhan_dto_1.UpdateKpmrKepatuhanDto]),
    __metadata("design:returntype", void 0)
], KpmrKepatuhanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KpmrKepatuhanController.prototype, "remove", null);
exports.KpmrKepatuhanController = KpmrKepatuhanController = __decorate([
    (0, common_1.Controller)('kpmr-kepatuhan'),
    __metadata("design:paramtypes", [kpmr_kepatuhan_service_1.KpmrKepatuhanService])
], KpmrKepatuhanController);
//# sourceMappingURL=kpmr-kepatuhan.controller.js.map