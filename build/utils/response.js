"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (payload, res) => {
    if (payload.payload) {
        return res.json({
            message: payload.message || "Successful",
            data: payload.payload,
            status: 200
        });
    }
    else {
        return res.status(400).json({
            message: payload.message,
            status: 400
        });
    }
};
exports.successResponse = successResponse;
const errorResponse = (message, res) => {
    return res.status(400).json({
        message,
        status: 400
    });
};
exports.errorResponse = errorResponse;
