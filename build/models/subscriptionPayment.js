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
const subscriptionPaymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    subscription: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subscription", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bank_transfer', 'wallet', 'paystack', 'flutterwave'],
        required: true
    },
    paymentReference: { type: String },
    transactionId: { type: String },
    gatewayResponse: { type: mongoose_1.Schema.Types.Mixed },
    description: { type: String, required: true },
    metadata: { type: mongoose_1.Schema.Types.Mixed }
}, {
    timestamps: true,
});
// Index for efficient queries
subscriptionPaymentSchema.index({ user: 1, status: 1 });
subscriptionPaymentSchema.index({ paymentReference: 1 });
subscriptionPaymentSchema.index({ transactionId: 1 });
const SubscriptionPayment = mongoose_1.default.model("SubscriptionPayment", subscriptionPaymentSchema);
exports.default = SubscriptionPayment;
