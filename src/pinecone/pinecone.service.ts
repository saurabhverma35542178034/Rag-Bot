import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pinecone } from "@pinecone-database/pinecone";

@Injectable()
export class PineconeService {
  private pc: Pinecone;

  constructor(private readonly config: ConfigService) {
    this.pc = new Pinecone({
      apiKey: this.config.getOrThrow("PINECONE_API_KEY"),
    });
  }

  async index(namespace?: string) {
    const indexName = this.config.getOrThrow("PINECONE_INDEX");
    const defaultNs = this.config.getOrThrow("PINECONE_NAMESPACE");

    // Get host, then target the index
    const desc = await this.pc.describeIndex(indexName);
    const idx = this.pc.index({ host: desc.host });

    return idx.namespace(namespace ?? defaultNs);
  }
}
