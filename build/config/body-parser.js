"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
body_parser_1.default.json({ limit: "50mb" });
body_parser_1.default.urlencoded({ limit: "50mb", extended: false });
exports.default = body_parser_1.default;
