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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = exports.SUBSCRIPTION_PLANS = void 0;
const typedi_1 = require("typedi");
const subscription_1 = __importStar(require("../models/subscription"));
const user_1 = __importDefault(require("../models/user"));
// Subscription plan configurations
exports.SUBSCRIPTION_PLANS = {
    [subscription_1.SubscriptionPlan.BASIC]: {
        name: "Basic Plan",
        price: 0,
        currency: "NGN",
        features: {
            maxHostels: 3,
            priorityListing: false,
            analytics: false,
            instantAlerts: false,
            featuredBadge: false,
            customProfile: false,
            promoCodes: false,
            pushNotifications: false,
            phoneSupport: false,
            earlyAccess: false
        }
    },
    [subscription_1.SubscriptionPlan.PRO]: {
        name: "Pro Plan",
        price: 3000,
        currency: "NGN",
        features: {
            maxHostels: 15,
            priorityListing: true,
            analytics: true,
            instantAlerts: true,
            featuredBadge: true,
            customProfile: true,
            promoCodes: false,
            pushNotifications: false,
            phoneSupport: false,
            earlyAccess: false
        }
    },
    [subscription_1.SubscriptionPlan.ELITE]: {
        name: "Elite Plan",
        price: 7000,
        currency: "NGN",
        features: {
            maxHostels: -1,
            priorityListing: true,
            analytics: true,
            instantAlerts: true,
            featuredBadge: true,
            customProfile: true,
            promoCodes: true,
            pushNotifications: true,
            phoneSupport: true,
            earlyAccess: true
        }
    }
};
let SubscriptionService = class SubscriptionService {
    createSubscription(userId, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                // Check if user already has an active subscription
                const existingSubscription = yield subscription_1.default.findOne({
                    user: userId,
                    status: 'active'
                });
                if (existingSubscription) {
                    throw new Error("User already has an active subscription");
                }
                const planConfig = exports.SUBSCRIPTION_PLANS[plan];
                if (!planConfig) {
                    throw new Error("Invalid subscription plan");
                }
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
                const subscription = yield subscription_1.default.create({
                    user: userId,
                    plan,
                    status: 'active',
                    startDate,
                    endDate,
                    amount: planConfig.price,
                    currency: planConfig.currency,
                    features: planConfig.features
                });
                // Update user with subscription info
                yield user_1.default.findByIdAndUpdate(userId, {
                    currentSubscription: subscription._id,
                    subscriptionPlan: plan,
                    subscriptionStatus: 'active',
                    subscriptionEndDate: endDate,
                    isVerifiedAgent: plan !== subscription_1.SubscriptionPlan.BASIC,
                    featuredAgent: plan === subscription_1.SubscriptionPlan.ELITE
                });
                return {
                    payload: subscription,
                    message: `Successfully subscribed to ${planConfig.name}`
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    cancelSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield subscription_1.default.findOne({
                    user: userId,
                    status: 'active'
                });
                if (!subscription) {
                    throw new Error("No active subscription found");
                }
                subscription.status = 'cancelled';
                subscription.autoRenew = false;
                yield subscription.save();
                // Update user subscription status
                yield user_1.default.findByIdAndUpdate(userId, {
                    subscriptionStatus: 'cancelled',
                    featuredAgent: false
                });
                return {
                    payload: subscription,
                    message: "Subscription cancelled successfully"
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getUserSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield subscription_1.default.findOne({
                    user: userId,
                    status: 'active'
                }).populate('user', 'firstName lastName email');
                if (!subscription) {
                    return {
                        payload: null,
                        message: "No active subscription found"
                    };
                }
                return {
                    payload: subscription,
                    message: "Subscription retrieved successfully"
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    checkSubscriptionLimit(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield subscription_1.default.findOne({
                    user: userId,
                    status: 'active'
                });
                if (!subscription) {
                    // Basic plan limits for non-subscribed users
                    const currentCount = yield this.getUserHostelCount(userId);
                    return {
                        canCreate: currentCount < 3,
                        currentCount,
                        maxAllowed: 3
                    };
                }
                const currentCount = yield this.getUserHostelCount(userId);
                const maxAllowed = subscription.features.maxHostels === -1 ? Infinity : subscription.features.maxHostels;
                return {
                    canCreate: currentCount < maxAllowed,
                    currentCount,
                    maxAllowed
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getUserHostelCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { default: Hostels } = yield Promise.resolve().then(() => __importStar(require('../models/hostel')));
                return yield Hostels.countDocuments({ user: userId });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getSubscriptionFeatures(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield subscription_1.default.findOne({
                    user: userId,
                    status: 'active'
                });
                if (!subscription) {
                    // Return basic plan features
                    return {
                        payload: exports.SUBSCRIPTION_PLANS[subscription_1.SubscriptionPlan.BASIC].features,
                        message: "Basic plan features"
                    };
                }
                return {
                    payload: subscription.features,
                    message: "Subscription features retrieved successfully"
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateSubscriptionStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find expired subscriptions
                const expiredSubscriptions = yield subscription_1.default.find({
                    status: 'active',
                    endDate: { $lt: new Date() }
                });
                for (const subscription of expiredSubscriptions) {
                    subscription.status = 'expired';
                    yield subscription.save();
                    // Update user status
                    yield user_1.default.findByIdAndUpdate(subscription.user, {
                        subscriptionStatus: 'expired',
                        featuredAgent: false
                    });
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getAvailablePlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    payload: exports.SUBSCRIPTION_PLANS,
                    message: "Available subscription plans"
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    upgradeSubscription(userId, newPlan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentSubscription = yield subscription_1.default.findOne({
                    user: userId,
                    status: 'active'
                });
                if (!currentSubscription) {
                    throw new Error("No active subscription to upgrade");
                }
                if (currentSubscription.plan === newPlan) {
                    throw new Error("Cannot upgrade to the same plan");
                }
                const planConfig = exports.SUBSCRIPTION_PLANS[newPlan];
                if (!planConfig) {
                    throw new Error("Invalid subscription plan");
                }
                // Cancel current subscription
                currentSubscription.status = 'cancelled';
                yield currentSubscription.save();
                // Create new subscription
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                const newSubscription = yield subscription_1.default.create({
                    user: userId,
                    plan: newPlan,
                    status: 'active',
                    startDate,
                    endDate,
                    amount: planConfig.price,
                    currency: planConfig.currency,
                    features: planConfig.features
                });
                // Update user
                yield user_1.default.findByIdAndUpdate(userId, {
                    currentSubscription: newSubscription._id,
                    subscriptionPlan: newPlan,
                    subscriptionStatus: 'active',
                    subscriptionEndDate: endDate,
                    featuredAgent: newPlan === subscription_1.SubscriptionPlan.ELITE
                });
                return {
                    payload: newSubscription,
                    message: `Successfully upgraded to ${planConfig.name}`
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    activateSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield subscription_1.default.findById(subscriptionId);
                if (!subscription) {
                    throw new Error("Subscription not found");
                }
                subscription.status = 'active';
                subscription.lastPaymentDate = new Date();
                yield subscription.save();
                // Update user subscription status
                yield user_1.default.findByIdAndUpdate(subscription.user, {
                    subscriptionStatus: 'active',
                    featuredAgent: subscription.plan === subscription_1.SubscriptionPlan.ELITE
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
};
SubscriptionService = __decorate([
    (0, typedi_1.Service)()
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
