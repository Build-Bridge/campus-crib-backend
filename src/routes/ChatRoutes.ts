import { Router } from "express";
import { Container } from "typedi";
import ChatController from "../controllers/ChatController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();
const chatController = Container.get(ChatController);

router.post("/message", verifyAuth, (req, res) => chatController.sendMessage(req, res));
router.get("/conversation/:conversationId", verifyAuth, (req, res) => chatController.getConversationMessages(req, res));
router.get("/conversations", verifyAuth, (req, res) => chatController.getUserConversations(req, res));

export default router;