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
const mongoose_1 = __importStar(require("mongoose"));
const subscription_1 = require("./subscription");
var UserType;
(function (UserType) {
    UserType["BASIC"] = "BASIC";
    UserType["AGENT"] = "AGENT";
})(UserType || (UserType = {}));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" },
    userType: { type: String, enum: Object.values(UserType), default: UserType.BASIC },
    schoolId: { type: String },
    phoneNumber: { type: String },
    proofOfAddress: {
        type: String
    },
    governmentId: {
        type: String
    },
    businessRegistration: {
        type: String
    },
    bookmarkedHostels: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Hostels" }],
    accountNumber: { type: String },
    bankName: { type: String },
    accountName: { type: String },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    // Subscription related fields
    currentSubscription: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subscription" },
    subscriptionPlan: { type: String, enum: Object.values(subscription_1.SubscriptionPlan) },
    subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled', 'expired'], default: 'inactive' },
    subscriptionEndDate: { type: Date },
    // Agent specific fields
    agentRating: { type: Number, default: 0 },
    agentReviews: { type: Number, default: 0 },
    isVerifiedAgent: { type: Boolean, default: false },
    featuredAgent: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const Users = mongoose_1.default.model("Users", userSchema);
exports.default = Users;
