"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const auth_entity_1 = require("../auth/entities/auth.entity");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [user_entity_1.User, auth_entity_1.Auth],
});
//# sourceMappingURL=data-source.js.map