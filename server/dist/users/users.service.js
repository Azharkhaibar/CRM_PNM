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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const get_user_dto_1 = require("./dto/get-user.dto");
const class_transformer_1 = require("class-transformer");
const auth_entity_1 = require("../auth/entities/auth.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
let UsersService = class UsersService {
    usersRepository;
    AuthRepository;
    constructor(usersRepository, AuthRepository) {
        this.usersRepository = usersRepository;
        this.AuthRepository = AuthRepository;
    }
    async register(dto) {
        const { userID, password, role, gender } = dto;
        const exists = await this.AuthRepository.findOne({
            where: { userID },
        });
        if (exists)
            throw new common_1.BadRequestException('User ID Already registered');
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = this.usersRepository.create({
            userID,
            role,
            gender,
        });
        await this.usersRepository.save(user);
        const auth = this.AuthRepository.create({
            userID,
            hash_password: hash,
            user,
        });
        return this.AuthRepository.save(auth);
    }
    async getUsersData() {
        try {
            const users = await this.usersRepository.find({ relations: ['auth'] });
            return users.map((user) => (0, class_transformer_1.plainToInstance)(get_user_dto_1.GetUserDto, user, { excludeExtraneousValues: true }));
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Failed to fetch users data');
        }
    }
    async getUserById(user_id) {
        try {
            const user = await this.usersRepository.findOne({
                where: { user_id },
                relations: ['auth'],
            });
            if (!user)
                throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
            return (0, class_transformer_1.plainToInstance)(get_user_dto_1.GetUserDto, user, {
                excludeExtraneousValues: true,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to fetch user');
        }
    }
    async updateUserById(user_id, dto) {
        try {
            const user = await this.usersRepository.findOne({
                where: { user_id },
            });
            if (!user)
                throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
            Object.assign(user, dto);
            const updated = await this.usersRepository.save(user);
            return (0, class_transformer_1.plainToInstance)(get_user_dto_1.GetUserDto, updated, {
                excludeExtraneousValues: true,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update user');
        }
    }
    async deleteUserById(user_id) {
        try {
            const user = await this.usersRepository.findOne({
                where: { user_id },
            });
            if (!user)
                throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
            await this.usersRepository.remove(user);
            return { message: `User with ID ${user_id} has been deleted` };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete user');
        }
    }
    async changePassword(userID, currentPassword, newPassword) {
        try {
            const auth = await this.AuthRepository.findOne({
                where: { userID },
                relations: ['user'],
            });
            if (!auth) {
                throw new common_1.NotFoundException('User not found');
            }
            const isCurrentPasswordValid = await bcrypt_1.default.compare(currentPassword, auth.hash_password);
            if (!isCurrentPasswordValid) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt_1.default.hash(newPassword, saltRounds);
            auth.hash_password = hashedNewPassword;
            await this.AuthRepository.save(auth);
            return {
                message: 'Password changed successfully',
                userID: auth.userID,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to change password');
        }
    }
    async requestPasswordReset(userID) {
        try {
            const auth = await this.AuthRepository.findOne({
                where: { userID },
                relations: ['user'],
            });
            if (!auth) {
                return {
                    message: 'If your user ID exists, a password reset link has been sent to your registered email',
                };
            }
            return {
                message: 'If your user ID exists, a password reset link has been sent to your registered email',
                userID: auth.userID,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.InternalServerErrorException('Failed to process password reset request');
            }
        }
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