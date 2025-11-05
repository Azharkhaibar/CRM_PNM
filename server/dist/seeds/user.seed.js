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
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../config/data-source");
const user_entity_1 = require("../users/entities/user.entity");
const auth_entity_1 = require("../auth/entities/auth.entity");
const userEnum_1 = require("../users/enum/userEnum");
const bcrypt = __importStar(require("bcrypt"));
async function seed() {
    await data_source_1.AppDataSource.initialize();
    const userRepo = data_source_1.AppDataSource.getRepository(user_entity_1.User);
    const authRepo = data_source_1.AppDataSource.getRepository(auth_entity_1.Auth);
    const passwordHash = await bcrypt.hash('RIMSPNM', 12);
    const user = userRepo.create({
        userID: 'GAS-10',
        role: userEnum_1.Role.USER,
        gender: userEnum_1.Gender.MALE,
    });
    const savedUser = await userRepo.save(user);
    const auth = authRepo.create({
        userID: 'GAS-20',
        hash_password: passwordHash,
        user: savedUser,
    });
    await authRepo.save(auth);
    console.log('Seeding done!');
    process.exit(0);
}
seed().catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
});
//# sourceMappingURL=user.seed.js.map