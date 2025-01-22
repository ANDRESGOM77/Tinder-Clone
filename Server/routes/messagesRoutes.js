import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getConversations, sendMessages } from '../controllers/messagesController.js';

const router = express.Router();

router.post("/send", protectRoute,sendMessages);
router.get("/conversation/:userId",protectRoute, getConversations);

export default router;