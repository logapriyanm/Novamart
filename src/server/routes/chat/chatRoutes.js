import express from 'express';
import { createChat, getChatList, getMessages, closeChat } from '../../controllers/chatController.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticate, createChat);
router.get('/list', authenticate, getChatList);
router.get('/:chatId/messages', authenticate, getMessages);
router.post('/:chatId/close', authenticate, closeChat);

export default router;

