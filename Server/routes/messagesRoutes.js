import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getConversations, sendMessages } from "../controllers/messagesController.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessages);
router.get("/conversation/:userId", getConversations);

export default router;
