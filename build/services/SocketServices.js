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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const socket_1 = require("../config/socket");
let SocketServices = class SocketServices {
    constructor() {
        this.io = null;
    }
    // Initialize the Socket.IO instance
    initialize() {
        try {
            this.io = (0, socket_1.getIo)();
            console.log("Socket.IO instance initialized");
        }
        catch (error) {
            console.error("Error initializing SocketServices:", error.message);
        }
    }
    sendSocketNotification(userId, notifcation) {
        (0, socket_1.emitSocketEvent)("notification", notifcation, userId);
    }
    sendSocketMessage(userId, message, conversationId) {
        (0, socket_1.emitSocketEvent)("chatMessage", { message, conversationId }, userId);
    }
};
SocketServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], SocketServices);
exports.default = SocketServices;
