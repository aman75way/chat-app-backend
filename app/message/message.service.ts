import prisma from "../common/services/database.service";
import { getReceiverSocketId, io } from "../common/services/socket.service";
import { MessageDTO } from "./message.dto";


/**
 * Service function to send a message from one user to another.
 * First, it checks if a conversation already exists between the two users.
 * If not, it creates a new conversation and adds the two users as participants.
 * Then, it creates a new message in the conversation with the sender's ID and the message body.
 * Finally, it emits a "newMessage" event to the receiver's socket.
 * @param {string} senderId - The ID of the user sending the message.
 * @param {string} receiverId - The ID of the user receiving the message.
 * @param {string} message - The message body.
 * @returns {Promise<MessageDTO>} - A promise that resolves to a MessageDTO object representing the sent message.
 */
export const sendMessageService = async (
    senderId: string,
    receiverId: string,
    message: string
): Promise<MessageDTO> => {

    let conversation = await prisma.conversation.findFirst({
        where: {
            participantIds: {
                hasEvery: [senderId, receiverId],
            },
        },
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                participantIds: {
                    set: [senderId, receiverId],
                },
            },
        });
    }

    const newMessage = await prisma.message.create({
        data: {
            senderId,
            body: message,
            conversationId: conversation.id,
        },
    });

    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages: { connect: { id: newMessage.id } } },
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Return the message as a MessageDTO
    return newMessage;
};


/**
 * Retrieves all messages in a conversation between the sender and the user to chat with.
 * If there is no conversation between the two users, an empty array is returned.
 * @param {string} senderId - The ID of the sender.
 * @param {string} userToChatId - The ID of the user to chat with.
 * @returns {Promise<MessageDTO[]>} - A promise that resolves to an array of MessageDTO objects, which contain the message's ID, sender ID, body, and creation date.
 */
export const getMessagesService = async (
    senderId: string,
    userToChatId: string
): Promise<MessageDTO[]> => {

    const conversation = await prisma.conversation.findFirst({
        where: {
            participantIds: {
                hasEvery: [senderId, userToChatId],
            },
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    return conversation ? conversation.messages : [];
};



/**
 * Retrieves a list of users for displaying in the sidebar, excluding the authenticated user.
 * The returned users contain minimal information necessary for sidebar display.
 * 
 * @param {string} authUserId - The ID of the authenticated user to be excluded from the list.
 * @returns {Promise<Array<{ id: string, fullName: string, profilePic: string }>>} - A promise that resolves to an array of user objects, each containing the user's id, full name, and profile picture.
 */

export const getUsersForSidebarService = async (authUserId: string) => {
    return await prisma.user.findMany({
        where: {
            id: {
                not: authUserId,
            },
        },
        select: {
            id: true,
            fullName: true,
            profilePic: true,
        },
    });
};
