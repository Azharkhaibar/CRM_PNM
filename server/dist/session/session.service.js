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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./entities/session.entity");
let SessionService = class SessionService {
    sessionRepository;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async createSession(auth, userAgent) {
        const session = this.sessionRepository.create({
            auth: { auth_id: auth.auth_id },
            user: auth.user,
            user_agent: userAgent,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            is_active: true,
        });
        return await this.sessionRepository.save(session);
    }
    async validateSession(sessionId) {
        const session = await this.sessionRepository.findOne({
            where: {
                session_id: sessionId,
                is_active: true,
                expires_at: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        return !!session;
    }
    async findSessionsByUser(userId) {
        return await this.sessionRepository.find({
            where: {
                user: { user_id: userId },
                is_active: true,
                expires_at: (0, typeorm_2.MoreThan)(new Date()),
            },
            relations: ['auth', 'user'],
            order: { created_at: 'DESC' },
        });
    }
    async findOneForUser(userId, sessionId) {
        const session = await this.sessionRepository.findOne({
            where: {
                session_id: sessionId,
                is_active: true,
            },
            relations: ['user'],
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.user.user_id !== userId) {
            throw new common_1.ForbiddenException('Access denied to this session');
        }
        return session;
    }
    async removeForUser(userId, sessionId) {
        const session = await this.findOneForUser(userId, sessionId);
        await this.sessionRepository.update(sessionId, {
            is_active: false,
        });
        return { message: 'Session removed successfully' };
    }
    async removeAllUserSessions(userId) {
        await this.sessionRepository.update({
            user: { user_id: userId },
            is_active: true,
        }, {
            is_active: false,
        });
        return { message: 'All sessions removed successfully' };
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SessionService);
//# sourceMappingURL=session.service.js.map