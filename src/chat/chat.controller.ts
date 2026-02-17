import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  async ask(
    @Body() body: { question: string; namespace?: string; topK?: number },
  ) {
    return this.chat.ask(body.question, body.namespace, body.topK ?? 6);
  }
}
