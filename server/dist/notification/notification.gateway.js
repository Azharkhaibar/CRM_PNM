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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt = __importStar(require("jsonwebtoken"));
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    server;
    logger = new common_1.Logger(NotificationGateway_1.name);
    clients = new Map();
    handleConnection(client) {
        const token = client.handshake.auth?.token;
        if (!token) {
            client.disconnect(true);
            return;
        }
        const user = this.verifyToken(token);
        if (!user) {
            client.disconnect(true);
            return;
        }
        this.clients.set(client.id, user.userId);
        client.join(`user:${user.userId}`);
        this.logger.log(`WS connected: user=${user.userId}, socket=${client.id}`);
    }
    handleDisconnect(client) {
        const userId = this.clients.get(client.id);
        if (userId) {
            this.clients.delete(client.id);
            this.logger.log(`WS disconnected: user=${userId}, socket=${client.id}`);
        }
    }
    sendNotificationToUser(userId, payload) {
        try {
            this.server.to(`user:${userId}`).emit('notification', payload);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    sendNotificationToAll(payload) {
        this.server.emit('notification:broadcast', payload);
    }
    broadcastUserStatus(userId, status) {
        this.server.emit('user:status', {
            userId,
            status,
            timestamp: new Date().toISOString(),
        });
    }
    sendToUser(userId, payload) {
        this.server.to(`user:${userId}`).emit('notification', payload);
    }
    sendToAll(payload) {
        this.server.emit('notification:broadcast', payload);
    }
    emitLoginEvent(userId, meta) {
        this.sendToUser(userId, {
            type: 'LOGIN',
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }
    emitLogoutEvent(userId, meta) {
        this.sendToUser(userId, {
            type: 'LOGOUT',
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }
    verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            const userId = Number(decoded.sub);
            if (Number.isNaN(userId))
                return null;
            return { userId };
        }
        catch {
            return null;
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: 'http://localhost:5173', credentials: true },
        namespace: '/notifications',
    })
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map