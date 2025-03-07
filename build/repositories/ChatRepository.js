"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const chatConversation_1 = __importDefault(require("../models/chatConversation"));
const chatMessages_1 = __importDefault(require("../models/chatMessages"));
let ChatRepository = class ChatRepository {
    createConversation(participants, lastMessage, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatConversation_1.default.create({
                participants,
                lastMessage,
                lastMessageAt: new Date(),
                user,
            });
        });
    }
    findConversation(participants) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatConversation_1.default.findOne({
                participants: { $all: participants },
            });
        });
    }
    updateConversation(conversationId, lastMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatConversation_1.default.findByIdAndUpdate(conversationId, { lastMessage, lastMessageAt: new Date() }, { new: true });
        });
    }
    createMessage(sender, recipient, message, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatMessages_1.default.create({
                sender,
                recipient,
                message,
                conversationId,
            });
        });
    }
    getMessagesByConversation(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                const conversation = yield chatConversation_1.default.findOne({
                    participants: { $all: [userId, conversationId] },
                });
                //   if (!conversation) {
                //     throw new Error("Conversation not found");
                //   }
                //   conversationId = conversation._id.toString();
            }
            return yield chatMessages_1.default.find({ conversationId }).sort({ timestamp: 1 });
        });
    }
    getUserConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chatConversation_1.default.find({ user: userId }).sort({
                lastMessageAt: -1,
            });
        });
    }
};
ChatRepository = __decorate([
    (0, typedi_1.Service)()
], ChatRepository);
exports.default = ChatRepository;
