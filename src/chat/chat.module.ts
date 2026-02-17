import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PineconeModule } from "../pinecone/pinecone.module";
import { OpenAIModule } from "../openai/openai.module";

@Module({
  imports: [PineconeModule, OpenAIModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
