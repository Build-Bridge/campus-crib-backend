"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.CronService = void 0;
const typedi_1 = require("typedi");
const SubscriptionService_1 = require("./SubscriptionService");
const subscription_1 = __importDefault(require("../models/subscription"));
const user_1 = __importDefault(require("../models/user"));
let CronService = class CronService {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    // Check for expired subscriptions and update status
    checkExpiredSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Checking for expired subscriptions...");
                const expiredSubscriptions = yield subscription_1.default.find({
                    status: 'active',
                    endDate: { $lt: new Date() }
                });
                console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);
                for (const subscription of expiredSubscriptions) {
                    try {
                        // Update subscription status
                        subscription.status = 'expired';
                        yield subscription.save();
                        // Update user status
                        yield user_1.default.findByIdAndUpdate(subscription.user, {
                            subscriptionStatus: 'expired',
                            featuredAgent: false
                        });
                        console.log(`Expired subscription for user: ${subscription.user}`);
                    }
                    catch (error) {
                        console.error(`Error processing expired subscription ${subscription._id}:`, error);
                    }
                }
                console.log("Expired subscriptions check completed");
            }
            catch (error) {
                console.error("Error checking expired subscriptions:", error);
            }
        });
    }
    // Send renewal reminders
    sendRenewalReminders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Sending renewal reminders...");
                const threeDaysFromNow = new Date();
                threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                const subscriptionsExpiringSoon = yield subscription_1.default.find({
                    status: 'active',
                    endDate: {
                        $gte: new Date(),
                        $lte: threeDaysFromNow
                    },
                    autoRenew: true
                });
                console.log(`Found ${subscriptionsExpiringSoon.length} subscriptions expiring soon`);
                for (const subscription of subscriptionsExpiringSoon) {
                    try {
                        // Send renewal reminder notification
                        yield this.sendRenewalNotification(subscription);
                        console.log(`Sent renewal reminder for subscription: ${subscription._id}`);
                    }
                    catch (error) {
                        console.error(`Error sending renewal reminder for subscription ${subscription._id}:`, error);
                    }
                }
                console.log("Renewal reminders sent");
            }
            catch (error) {
                console.error("Error sending renewal reminders:", error);
            }
        });
    }
    // Process auto-renewals
    processAutoRenewals() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Processing auto-renewals...");
                const subscriptionsToRenew = yield subscription_1.default.find({
                    status: 'active',
                    endDate: { $lte: new Date() },
                    autoRenew: true
                });
                console.log(`Found ${subscriptionsToRenew.length} subscriptions to auto-renew`);
                for (const subscription of subscriptionsToRenew) {
                    try {
                        // Extend subscription by one month
                        const newEndDate = new Date(subscription.endDate);
                        newEndDate.setMonth(newEndDate.getMonth() + 1);
                        subscription.endDate = newEndDate;
                        subscription.lastPaymentDate = new Date();
                        yield subscription.save();
                        // Update user subscription end date
                        yield user_1.default.findByIdAndUpdate(subscription.user, {
                            subscriptionEndDate: newEndDate
                        });
                        console.log(`Auto-renewed subscription: ${subscription._id}`);
                    }
                    catch (error) {
                        console.error(`Error auto-renewing subscription ${subscription._id}:`, error);
                    }
                }
                console.log("Auto-renewals processed");
            }
            catch (error) {
                console.error("Error processing auto-renewals:", error);
            }
        });
    }
    // Generate subscription reports
    generateSubscriptionReports() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Generating subscription reports...");
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                // Get subscription statistics for the current month
                const activeSubscriptions = yield subscription_1.default.countDocuments({
                    status: 'active',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                });
                const totalRevenue = yield subscription_1.default.aggregate([
                    {
                        $match: {
                            status: 'active',
                            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }
                ]);
                const planDistribution = yield subscription_1.default.aggregate([
                    {
                        $match: {
                            status: 'active',
                            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                        }
                    },
                    {
                        $group: {
                            _id: '$plan',
                            count: { $sum: 1 }
                        }
                    }
                ]);
                const report = {
                    month: now.toISOString().slice(0, 7),
                    activeSubscriptions,
                    totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                    planDistribution,
                    generatedAt: now
                };
                console.log("Subscription report:", report);
                console.log("Subscription reports generated");
            }
            catch (error) {
                console.error("Error generating subscription reports:", error);
            }
        });
    }
    sendRenewalNotification(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a placeholder implementation
            // In a real application, integrate with your notification service
            console.log(`Sending renewal reminder to user ${subscription.user} for plan ${subscription.plan}`);
            // Example notification data
            const notificationData = {
                title: "Subscription Renewal Reminder",
                message: `Your ${subscription.plan} subscription expires in 3 days. Renew now to continue enjoying premium features.`,
                actionLink: `/subscriptions/renew`,
                user: subscription.user
            };
            // Send notification via your notification service
            // await this.notificationService.createNotification(notificationData);
        });
    }
    // Start all cron jobs
    startCronJobs() {
        console.log("Starting cron jobs...");
        // Check expired subscriptions every hour
        setInterval(() => {
            this.checkExpiredSubscriptions();
        }, 60 * 60 * 1000); // 1 hour
        // Send renewal reminders daily at 9 AM
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 9 && now.getMinutes() === 0) {
                this.sendRenewalReminders();
            }
        }, 60 * 1000); // Check every minute
        // Process auto-renewals daily at 12 AM
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                this.processAutoRenewals();
            }
        }, 60 * 1000); // Check every minute
        // Generate reports monthly on the 1st
        setInterval(() => {
            const now = new Date();
            if (now.getDate() === 1 && now.getHours() === 6 && now.getMinutes() === 0) {
                this.generateSubscriptionReports();
            }
        }, 60 * 1000); // Check every minute
        console.log("Cron jobs started");
    }
};
CronService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [SubscriptionService_1.SubscriptionService])
], CronService);
exports.CronService = CronService;
