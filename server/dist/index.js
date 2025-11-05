"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = void 0;
require("dotenv/config");
const promise_1 = __importDefault(require("mysql2/promise"));
const initDb = async () => {
    const connection = await promise_1.default.createConnection(process.env.DATABASE_URL ?? 'mysql://root:@localhost:3306/magangpnm');
};
exports.initDb = initDb;
//# sourceMappingURL=index.js.map