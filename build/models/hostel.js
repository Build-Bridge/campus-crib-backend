"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostelTypes = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var HostelTypes;
(function (HostelTypes) {
    HostelTypes["SINGLE_ROOMS"] = "SINGLE_ROOMS";
    HostelTypes["SHARED_ROOMS"] = "SHARED_ROOMS";
    HostelTypes["APARTMENTS"] = "APARTMENTS";
    HostelTypes["SUITES"] = "SUITES";
})(HostelTypes = exports.HostelTypes || (exports.HostelTypes = {}));
const hostelSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Users", required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    availableRooms: { type: Number, default: 1 },
    isAvailable: { type: Boolean, default: true },
    hostelName: { type: String, required: true },
    hostelType: { type: String, enum: Object.values(HostelTypes), default: HostelTypes.SINGLE_ROOMS },
    cover: { type: String },
}, {
    timestamps: true,
});
const Hostels = mongoose_1.default.model("Hostels", hostelSchema);
exports.default = Hostels;
