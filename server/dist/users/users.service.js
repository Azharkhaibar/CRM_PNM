"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const auth_entity_1 = require("../auth/entities/auth.entity");
const get_user_dto_1 = require("./dto/get-user.dto");
const bcrypt = __importStar(require("bcrypt"));
const class_transformer_1 = require("class-transformer");
const userEnum_1 = require("./enum/userEnum");
let UsersService = class UsersService {
    usersRepository;
    authRepository;
    constructor(usersRepository, authRepository) {
        this.usersRepository = usersRepository;
        this.authRepository = authRepository;
    }
    async register(createUserDto) {
        const { auth: authDto, ...userData } = createUserDto;
        const existingAuth = await this.authRepository.findOne({
            where: { email: authDto.email },
        });
        if (existingAuth) {
            throw new common_1.ConflictException('email already exists');
        }
        const existingUsername = await this.usersRepository.findOne({
            where: { username: userData.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException('username already exists');
        }
        const userCount = await this.usersRepository.count();
        const userRole = userCount === 0 ? userEnum_1.Role.ADMIN : userEnum_1.Role.USER;
        const hashpswd = await bcrypt.hash(authDto.password, 12);
        const auth = this.authRepository.create({
            email: authDto.email,
            hash_password: hashpswd,
        });
        const user = this.usersRepository.create({
            ...userData,
            role: userRole,
            auth,
        });
        const savedUser = await this.usersRepository.save(user);
        return (0, class_transformer_1.plainToInstance)(get_user_dto_1.GetUserDto, savedUser, {
            excludeExtraneousValues: true,
        });
    }
    async UserGetById(id) {
        const getUser = await this.usersRepository.findOne({
            where: { user_id: id },
        });
        if (!getUser)
            throw new common_1.NotFoundException(`User with ID ${id} is not found`);
        return (0, class_transformer_1.plainToInstance)(get_user_dto_1.GetUserDto, getUser, {
            excludeExtraneousValues: true,
        });
    }
    async getUsersData() {
        const checkuser = await this.usersRepository.findOne({});
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map