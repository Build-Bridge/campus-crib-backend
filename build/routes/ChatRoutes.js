"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const router = (0, express_1.Router)();
const chatController = typedi_1.Container.get(ChatController_1.default);
router.post("/message", verifyAuth_1.verifyAuth, (req, res) => chatController.sendMessage(req, res));
router.get("/conversation/:conversationId", verifyAuth_1.verifyAuth, (req, res) => chatController.getConversationMessages(req, res));
router.get("/conversations", verifyAuth_1.verifyAuth, (req, res) => chatController.getUserConversations(req, res));
router.get("/conversation/user/:otherUserId", verifyAuth_1.verifyAuth, (req, res) => chatController.getConversationMessagesByUser(req, res));
exports.default = router;
