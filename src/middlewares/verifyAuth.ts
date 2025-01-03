import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const verifyAuth = (request: Request, response: Response, next: NextFunction): void => {
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
    const payload = jwt.verify(token, jwtSecret) as { id: string };

    if (!payload || !payload.id) {
      response.status(401).json({ message: "Token verification failed" });
      return;
    }

    // Attach user info to the request object
    request.body.user = payload.id;

    // Proceed to the next middleware
    next();
  } catch (err: any) {
    console.error("Error in verifyAuth middleware:", err);
    response.status(401).json({ message: err.message || "User not authorized" });
  }
};
