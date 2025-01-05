"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const verifyAuth = (request, response, next) => {
    try {
        // Check if the Authorization header is present
        const authorization = request.headers.authorization;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            response.status(401).json({ message: "Authorization header is missing or invalid" });
            return;
        }
        // Extract the token
        const token = authorization.split(" ")[1];
        if (!token) {
            response.status(401).json({ message: "Token is missing from the Authorization header" });
            return;
        }
        // Verify the token
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!payload || !payload.id) {
            response.status(401).json({ message: "Token verification failed" });
            return;
        }
        // Attach user info to the request object
        request.body.user = payload.id;
        // Proceed to the next middleware
        next();
    }
    catch (err) {
        console.error("Error in verifyAuth middleware:", err);
        response.status(401).json({ message: err.message || "User not authorized" });
    }
};
exports.verifyAuth = verifyAuth;
