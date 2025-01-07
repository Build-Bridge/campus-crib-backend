"use strict";
// src/config/socket.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedUsers = exports.getIo = exports.initSocket = exports.emitSocketEvent = void 0;
const socket_io_1 = require("socket.io");
// This map will hold userId as key and socketId as value
const connectedUsers = new Map();
exports.connectedUsers = connectedUsers;
let io = null;
// Initialize Socket.IO
const initSocket = (server) => {
    io = new socket_io_1.Server(server);
    console.log("Socket.IO server initialized");
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        // Listen for user identification event
        socket.on("init", (userId) => {
            console.log(`User identified: ${userId}`);
            connectedUsers.set(userId, socket.id);
            // Notify other clients of the user's online status
            io === null || io === void 0 ? void 0 : io.emit("userOnline", userId);
        });
        // Handle client disconnection
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            // Find userId based on socketId and remove from the map
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    // Notify others of the user's offline status
                    io === null || io === void 0 ? void 0 : io.emit("userOffline", userId);
                    break;
                }
            }
        });
    });
};
exports.initSocket = initSocket;
const emitSocketEvent = (event, data, userId) => {
    if (io) {
        const socketId = connectedUsers.get(userId); // Get the socketId from the map
        if (socketId) {
            console.log("sent");
            io.to(socketId).emit(event, data); // Emit event to the specific socketId
        }
        else {
            console.log("socketId not found for userId:", userId);
        }
    }
    else {
        console.log("Socket.IO is not initialized");
    }
};
exports.emitSocketEvent = emitSocketEvent;
// Get the initialized Socket.IO instance
const getIo = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};
exports.getIo = getIo;
