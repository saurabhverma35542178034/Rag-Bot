import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenAIService {
  private client: OpenAI;
  private model: string;

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.getOrThrow("OPENAI_API_KEY"),
    });
    this.model = this.config.getOrThrow("OPENAI_MODEL");
  }

  async chatAnswer(args: { question: string; context: string }) {
    const { question, context } = args;

    const resp = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      max_completion_tokens: 450,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Use ONLY the provided sources. If the answer is not in the sources, say you do not know.",
        },
        {
          role: "user",
          content: `Question:\n${question}\n\nSources:\n${context}`,
        },
      ],
    });

    return resp.choices?.[0]?.message?.content ?? "";
  }
}
