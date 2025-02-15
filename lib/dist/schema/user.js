"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserInput = exports.user = void 0;
const zod_1 = require("zod");
exports.user = zod_1.z.object({
    id: zod_1.z.number(),
    email: zod_1.z.string().email(),
    created_at: zod_1.z.coerce.date(),
    updated_at: zod_1.z.coerce.date(),
});
exports.createUserInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password_hash: zod_1.z.string(),
});
