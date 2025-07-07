import { Service } from "typedi";
import { SubscriptionService } from "./SubscriptionService";
import Subscription from "../models/subscription";
import Users from "../models/user";

@Service()
export class CronService {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    // Check for expired subscriptions and update status
    async checkExpiredSubscriptions(): Promise<void> {
        try {
            console.log("Checking for expired subscriptions...");
            
            const expiredSubscriptions = await Subscription.find({
                status: 'active',
                endDate: { $lt: new Date() }
            });

            console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);

            for (const subscription of expiredSubscriptions) {
                try {
                    // Update subscription status
                    subscription.status = 'expired';
                    await subscription.save();

                    // Update user status
                    await Users.findByIdAndUpdate(subscription.user, {
                        subscriptionStatus: 'expired',
                        featuredAgent: false
                    });

                    console.log(`Expired subscription for user: ${subscription.user}`);
                } catch (error) {
                    console.error(`Error processing expired subscription ${subscription._id}:`, error);
                }
            }

            console.log("Expired subscriptions check completed");
        } catch (error) {
            console.error("Error checking expired subscriptions:", error);
        }
    }

    // Send renewal reminders
    async sendRenewalReminders(): Promise<void> {
        try {
            console.log("Sending renewal reminders...");
            
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

            const subscriptionsExpiringSoon = await Subscription.find({
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
                    await this.sendRenewalNotification(subscription);
                    console.log(`Sent renewal reminder for subscription: ${subscription._id}`);
                } catch (error) {
                    console.error(`Error sending renewal reminder for subscription ${subscription._id}:`, error);
                }
            }

            console.log("Renewal reminders sent");
        } catch (error) {
            console.error("Error sending renewal reminders:", error);
        }
    }

    // Process auto-renewals
    async processAutoRenewals(): Promise<void> {
        try {
            console.log("Processing auto-renewals...");
            
            const subscriptionsToRenew = await Subscription.find({
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
                    await subscription.save();

                    // Update user subscription end date
                    await Users.findByIdAndUpdate(subscription.user, {
                        subscriptionEndDate: newEndDate
                    });

                    console.log(`Auto-renewed subscription: ${subscription._id}`);
                } catch (error) {
                    console.error(`Error auto-renewing subscription ${subscription._id}:`, error);
                }
            }

            console.log("Auto-renewals processed");
        } catch (error) {
            console.error("Error processing auto-renewals:", error);
        }
    }

    // Generate subscription reports
    async generateSubscriptionReports(): Promise<void> {
        try {
            console.log("Generating subscription reports...");
            
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            // Get subscription statistics for the current month
            const activeSubscriptions = await Subscription.countDocuments({
                status: 'active',
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            });

            const totalRevenue = await Subscription.aggregate([
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

            const planDistribution = await Subscription.aggregate([
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
                totalRevenue: totalRevenue[0]?.total || 0,
                planDistribution,
                generatedAt: now
            };

            console.log("Subscription report:", report);
            console.log("Subscription reports generated");
        } catch (error) {
            console.error("Error generating subscription reports:", error);
        }
    }

    private async sendRenewalNotification(subscription: any): Promise<void> {
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
    }

    // Start all cron jobs
    startCronJobs(): void {
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
} 