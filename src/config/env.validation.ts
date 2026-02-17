import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().optional(),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-5.2-chat-latest"),
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_INDEX: z.string().min(1),
  PINECONE_NAMESPACE: z.string().min(1).default("default"),
});

export function validateEnv(config: Record<string, unknown>) {
  const parsed = EnvSchema.safeParse(config);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("❌ Invalid environment variables");
  }
  return parsed.data;
}
