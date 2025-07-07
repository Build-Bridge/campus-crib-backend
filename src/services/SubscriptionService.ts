import { Types } from "mongoose";
import { Service } from "typedi";
import Subscription, { SubscriptionPlan, ISubscription } from "../models/subscription";
import Users from "../models/user";
import { Payload } from "../utils/response";

// Subscription plan configurations
export const SUBSCRIPTION_PLANS = {
    [SubscriptionPlan.BASIC]: {
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
    [SubscriptionPlan.PRO]: {
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
    [SubscriptionPlan.ELITE]: {
        name: "Elite Plan",
        price: 7000,
        currency: "NGN",
        features: {
            maxHostels: -1, // Unlimited
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

@Service()
export class SubscriptionService {
    
    async createSubscription(userId: string, plan: SubscriptionPlan): Promise<Payload> {
        try {
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Check if user already has an active subscription
            const existingSubscription = await Subscription.findOne({
                user: userId,
                status: 'active'
            });

            if (existingSubscription) {
                throw new Error("User already has an active subscription");
            }

            const planConfig = SUBSCRIPTION_PLANS[plan];
            if (!planConfig) {
                throw new Error("Invalid subscription plan");
            }

            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

            const subscription = await Subscription.create({
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
            await Users.findByIdAndUpdate(userId, {
                currentSubscription: subscription._id,
                subscriptionPlan: plan,
                subscriptionStatus: 'active',
                subscriptionEndDate: endDate,
                isVerifiedAgent: plan !== SubscriptionPlan.BASIC,
                featuredAgent: plan === SubscriptionPlan.ELITE
            });

            return {
                payload: subscription,
                message: `Successfully subscribed to ${planConfig.name}`
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async cancelSubscription(userId: string): Promise<Payload> {
        try {
            const subscription = await Subscription.findOne({
                user: userId,
                status: 'active'
            });

            if (!subscription) {
                throw new Error("No active subscription found");
            }

            subscription.status = 'cancelled';
            subscription.autoRenew = false;
            await subscription.save();

            // Update user subscription status
            await Users.findByIdAndUpdate(userId, {
                subscriptionStatus: 'cancelled',
                featuredAgent: false
            });

            return {
                payload: subscription,
                message: "Subscription cancelled successfully"
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getUserSubscription(userId: string): Promise<Payload> {
        try {
            const subscription = await Subscription.findOne({
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async checkSubscriptionLimit(userId: string): Promise<{ canCreate: boolean; currentCount: number; maxAllowed: number }> {
        try {
            const subscription = await Subscription.findOne({
                user: userId,
                status: 'active'
            });

            if (!subscription) {
                // Basic plan limits for non-subscribed users
                const currentCount = await this.getUserHostelCount(userId);
                return {
                    canCreate: currentCount < 3,
                    currentCount,
                    maxAllowed: 3
                };
            }

            const currentCount = await this.getUserHostelCount(userId);
            const maxAllowed = subscription.features.maxHostels === -1 ? Infinity : subscription.features.maxHostels;

            return {
                canCreate: currentCount < maxAllowed,
                currentCount,
                maxAllowed
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getUserHostelCount(userId: string): Promise<number> {
        try {
            const { default: Hostels } = await import('../models/hostel');
            return await Hostels.countDocuments({ user: userId });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getSubscriptionFeatures(userId: string): Promise<Payload> {
        try {
            const subscription = await Subscription.findOne({
                user: userId,
                status: 'active'
            });

            if (!subscription) {
                // Return basic plan features
                return {
                    payload: SUBSCRIPTION_PLANS[SubscriptionPlan.BASIC].features,
                    message: "Basic plan features"
                };
            }

            return {
                payload: subscription.features,
                message: "Subscription features retrieved successfully"
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async updateSubscriptionStatus(): Promise<void> {
        try {
            // Find expired subscriptions
            const expiredSubscriptions = await Subscription.find({
                status: 'active',
                endDate: { $lt: new Date() }
            });

            for (const subscription of expiredSubscriptions) {
                subscription.status = 'expired';
                await subscription.save();

                // Update user status
                await Users.findByIdAndUpdate(subscription.user, {
                    subscriptionStatus: 'expired',
                    featuredAgent: false
                });
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getAvailablePlans(): Promise<Payload> {
        try {
            return {
                payload: SUBSCRIPTION_PLANS,
                message: "Available subscription plans"
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async upgradeSubscription(userId: string, newPlan: SubscriptionPlan): Promise<Payload> {
        try {
            const currentSubscription = await Subscription.findOne({
                user: userId,
                status: 'active'
            });

            if (!currentSubscription) {
                throw new Error("No active subscription to upgrade");
            }

            if (currentSubscription.plan === newPlan) {
                throw new Error("Cannot upgrade to the same plan");
            }

            const planConfig = SUBSCRIPTION_PLANS[newPlan];
            if (!planConfig) {
                throw new Error("Invalid subscription plan");
            }

            // Cancel current subscription
            currentSubscription.status = 'cancelled';
            await currentSubscription.save();

            // Create new subscription
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);

            const newSubscription = await Subscription.create({
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
            await Users.findByIdAndUpdate(userId, {
                currentSubscription: newSubscription._id,
                subscriptionPlan: newPlan,
                subscriptionStatus: 'active',
                subscriptionEndDate: endDate,
                featuredAgent: newPlan === SubscriptionPlan.ELITE
            });

            return {
                payload: newSubscription,
                message: `Successfully upgraded to ${planConfig.name}`
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async activateSubscription(subscriptionId: string): Promise<void> {
        try {
            const subscription = await Subscription.findById(subscriptionId);
            if (!subscription) {
                throw new Error("Subscription not found");
            }

            subscription.status = 'active';
            subscription.lastPaymentDate = new Date();
            await subscription.save();

            // Update user subscription status
            await Users.findByIdAndUpdate(subscription.user, {
                subscriptionStatus: 'active',
                featuredAgent: subscription.plan === SubscriptionPlan.ELITE
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
} 