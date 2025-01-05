"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const ChatRepository_1 = __importDefault(require("../repositories/ChatRepository"));
let ChatService = class ChatService {
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    sendMessage(sender, recipient, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if conversation exists
            const participants = [sender, recipient];
            let conversation = yield this.chatRepo.findConversation(participants);
            // If not, create a new conversation
            if (!conversation) {
                conversation = yield this.chatRepo.createConversation(participants, message);
            }
            else {
                yield this.chatRepo.updateConversation(conversation.id, message);
            }
            // Save the message
            const chatMessage = yield this.chatRepo.createMessage(sender, recipient, message, conversation.id);
            return { payload: chatMessage, message: "Message sent Successfully" };
        });
    }
    getConversationMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return { payload: yield this.chatRepo.getMessagesByConversation(conversationId), message: "Successful" };
        });
    }
    getUserConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return { payload: yield this.chatRepo.getUserConversations(userId), message: "Successful" };
        });
    }
};
ChatService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [ChatRepository_1.default])
], ChatService);
exports.default = ChatService;
