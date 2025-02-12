import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { sendMessageService, getMessagesService, getUsersForSidebarService } from "./message.service";
import { MessageDTO } from "./message.dto";

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user.id;

  const newMessage: MessageDTO = await sendMessageService(senderId, receiverId, message);
  res.status(201).json(newMessage);
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user.id;

  const messages: MessageDTO[] = await getMessagesService(senderId, userToChatId);
  res.status(200).json(messages);
});

export const getUsersForSidebar = asyncHandler(async (req: Request, res: Response) => {
  const authUserId = req.user.id;
  const users = await getUsersForSidebarService(authUserId);
  res.status(200).json(users);
});
