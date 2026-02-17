import { Module } from "@nestjs/common";
import { ConfigModuleX } from "./config/config.module";
import { PineconeModule } from "./pinecone/pinecone.module";
import { OpenAIModule } from "./openai/openai.module";
import { CrawlModule } from "./crawl/crawl.module";
import { IngestModule } from "./ingest/ingest.module";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [
    ConfigModuleX,
    PineconeModule,
    OpenAIModule,
    CrawlModule,
    IngestModule,
    ChatModule,
  ],
})
export class AppModule {}
