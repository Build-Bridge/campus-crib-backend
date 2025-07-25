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
const response_1 = require("../utils/response");
const ChatServices_1 = __importDefault(require("../services/ChatServices"));
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { recipient, message } = req.body;
                const sender = req.body.user; // From verifyAuth middleware
                const response = yield this.chatService.sendMessage(String(sender), recipient, message);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getConversationMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { conversationId } = req.params;
                const userId = req.body.user;
                const response = yield this.chatService.getConversationMessages(conversationId, userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getUserConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // From verifyAuth middleware
                console.log(userId);
                const response = yield this.chatService.getUserConversations(userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getConversationMessagesByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otherUserId } = req.params;
                const currentUserId = req.body.user; // From verifyAuth middleware
                const response = yield this.chatService.getConversationMessagesByUser(currentUserId, otherUserId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
};
ChatController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [ChatServices_1.default])
], ChatController);
exports.default = ChatController;
