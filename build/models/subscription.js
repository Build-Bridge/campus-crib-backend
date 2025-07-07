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
exports.SubscriptionPlan = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC"] = "BASIC";
    SubscriptionPlan["PRO"] = "PRO";
    SubscriptionPlan["ELITE"] = "ELITE";
})(SubscriptionPlan = exports.SubscriptionPlan || (exports.SubscriptionPlan = {}));
const subscriptionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    plan: {
        type: String,
        enum: Object.values(SubscriptionPlan),
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'inactive'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: { type: String },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    features: {
        maxHostels: { type: Number, required: true },
        priorityListing: { type: Boolean, default: false },
        analytics: { type: Boolean, default: false },
        instantAlerts: { type: Boolean, default: false },
        featuredBadge: { type: Boolean, default: false },
        customProfile: { type: Boolean, default: false },
        promoCodes: { type: Boolean, default: false },
        pushNotifications: { type: Boolean, default: false },
        phoneSupport: { type: Boolean, default: false },
        earlyAccess: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
});
// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });
const Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);
exports.default = Subscription;
