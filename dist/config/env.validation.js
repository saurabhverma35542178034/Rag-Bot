"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    PORT: zod_1.z.string().optional(),
    OPENAI_API_KEY: zod_1.z.string().min(1),
    OPENAI_MODEL: zod_1.z.string().min(1).default("gpt-5.2-chat-latest"),
    PINECONE_API_KEY: zod_1.z.string().min(1),
    PINECONE_INDEX: zod_1.z.string().min(1),
    PINECONE_NAMESPACE: zod_1.z.string().min(1).default("default"),
});
function validateEnv(config) {
    const parsed = EnvSchema.safeParse(config);
    if (!parsed.success) {
        console.error(parsed.error.flatten().fieldErrors);
        throw new Error("❌ Invalid environment variables");
    }
    return parsed.data;
}
//# sourceMappingURL=env.validation.js.map