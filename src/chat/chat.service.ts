import { Injectable } from "@nestjs/common";
import { PineconeService } from "../pinecone/pinecone.service";
import { OpenAIService } from "../openai/openai.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly pinecone: PineconeService,
    private readonly openai: OpenAIService,
  ) {}

  async ask(question: string, namespace?: string, topK = 6) {
    const index = await this.pinecone.index(namespace);

    // Integrated embedding: search with text
    const results = await index.searchRecords({
      query: {
        topK,
        inputs: { text: question },
      },
      fields: ["chunk_text", "url", "title"],
    });

    const hits = results?.result?.hits ?? [];

    const context = hits
      .map((h: any, i: number) => {
        const url = h?.fields?.url ?? "";
        const title = h?.fields?.title ?? "";
        const text = h?.fields?.chunk_text ?? "";
        return `Source ${i + 1}:\nTitle: ${title}\nURL: ${url}\nContent: ${text}`;
      })
      .join("\n\n");

    const answer = await this.openai.chatAnswer({ question, context });

    const sources = hits
      .map((h: any) => h?.fields?.url)
      .filter(Boolean)
      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
    
    try {
  const answer = await this.openai.chatAnswer({ question, context });
  return { answer, sources, retrieved: hits.length };
} catch (error: any) {
  console.error("Error generating answer:", error);
  return { answer: "Sorry, I couldn't generate an answer.", sources, retrieved: hits.length, error: error.message };
}

    return { answer, sources, retrieved: hits.length };
  }
}
