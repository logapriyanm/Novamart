import Chat from '../../models/Chat.js';
import Message from '../../models/Message.js';

export const createChat = async (req, res) => {
    try {
        const { type, contextId, receiverId, receiverRole } = req.body;
        const senderId = req.user.id;
        const senderRole = req.user.role;

        // 1. Validate Roles (Strict Governance)
        if (senderRole === 'CUSTOMER' && receiverRole !== 'DEALER') {
            return res.status(403).json({ message: 'Customers can only chat with Dealers' });
        }
        if (senderRole === 'DEALER' && !['CUSTOMER', 'MANUFACTURER', 'ADMIN'].includes(receiverRole)) {
            return res.status(403).json({ message: 'Invalid chat recipient for Dealer' });
        }

        // 2. Check for existing open chat of same type and context
        let chat = await Chat.findOne({
            type,
            contextId,
            'participants.userId': { $all: [senderId, receiverId] },
            status: 'OPEN'
        });

        if (!chat) {
            chat = new Chat({
                type,
                contextId,
                participants: [
                    { userId: senderId, role: senderRole },
                    { userId: receiverId, role: receiverRole }
                ]
            });
            await chat.save();
        }

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChatList = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({
            'participants.userId': userId
        }).sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .limit(50); // Simple limit for now

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const closeChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findByIdAndUpdate(chatId, {
            status: 'CLOSED',
            closedAt: new Date()
        }, { new: true });

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

