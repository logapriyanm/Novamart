import { apiClient } from '../client';
import { ENDPOINTS, ApiResponse } from '../contract';

export interface Chat {
    id: string;
    participants: { userId: string; name: string; role: string }[];
    lastMessage?: string;
    updatedAt: string;
    status: 'OPEN' | 'CLOSED';
}

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderRole: string;
    message: string;
    createdAt: string;
}

export const chatService = {
    async createChat(recipientId: string): Promise<Chat> {
        return apiClient.post<Chat>(ENDPOINTS.CHAT.CREATE, { recipientId });
    },

    async getChats(): Promise<Chat[]> {
        return apiClient.get<Chat[]>(ENDPOINTS.CHAT.LIST);
    },

    async getMessages(chatId: string): Promise<Message[]> {
        return apiClient.get<Message[]>(ENDPOINTS.CHAT.MESSAGES(chatId));
    },

    async closeChat(chatId: string): Promise<any> {
        return apiClient.post(ENDPOINTS.CHAT.CLOSE(chatId), {});
    }
};

export default chatService;
