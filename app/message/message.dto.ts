import { BaseSchema } from "../common/dto/base.dto";

export interface MessageDTO extends BaseSchema {
  senderId: string;
  conversationId: string;
  body: string;
}
