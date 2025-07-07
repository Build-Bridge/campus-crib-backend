import { Service } from "typedi";
import SubscriptionPayment, { ISubscriptionPayment } from "../models/subscriptionPayment";
import { SUBSCRIPTION_PLANS, SubscriptionService } from "./SubscriptionService";
import { SubscriptionPlan } from "../models/subscription";
import { Payload } from "../utils/response";
import crypto from "crypto";

@Service()
export class PaymentService {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    async initializePayment(userId: string, plan: SubscriptionPlan, paymentMethod: string): Promise<Payload> {
        try {
            const planConfig = SUBSCRIPTION_PLANS[plan];
            if (!planConfig) {
                throw new Error("Invalid subscription plan");
            }

            if (plan === SubscriptionPlan.BASIC) {
                // Basic plan is free, create subscription directly
                return await this.subscriptionService.createSubscription(userId, plan);
            }

            // Generate payment reference
            const paymentReference = this.generatePaymentReference();
            
            // Create a temporary subscription record
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);

            const subscription = await this.subscriptionService.createSubscription(userId, plan);
            
            // Create payment record
            const payment = await SubscriptionPayment.create({
                user: userId,
                subscription: subscription.payload._id,
                amount: planConfig.price,
                currency: planConfig.currency,
                paymentMethod,
                paymentReference,
                description: `Subscription payment for ${planConfig.name}`,
                metadata: {
                    plan,
                    planName: planConfig.name,
                    duration: '1 month'
                }
            });

            // Generate payment URL based on payment method
            const paymentUrl = await this.generatePaymentUrl(payment, planConfig);

            return {
                payload: {
                    payment,
                    paymentUrl,
                    subscription: subscription.payload
                },
                message: "Payment initialized successfully"
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async verifyPayment(paymentReference: string): Promise<Payload> {
        try {
            const payment = await SubscriptionPayment.findOne({ paymentReference });
            if (!payment) {
                throw new Error("Payment not found");
            }

            // Verify payment with payment gateway
            const verificationResult = await this.verifyPaymentWithGateway(payment);
            
            if (verificationResult.status === 'completed') {
                payment.status = 'completed';
                payment.transactionId = verificationResult.transactionId;
                payment.gatewayResponse = verificationResult.gatewayResponse;
                await payment.save();

                // Update subscription status
                await this.subscriptionService.activateSubscription(payment.subscription.toString());

                return {
                    payload: payment,
                    message: "Payment verified and subscription activated"
                };
            } else {
                payment.status = 'failed';
                payment.gatewayResponse = verificationResult.gatewayResponse;
                await payment.save();

                return {
                    payload: payment,
                    message: "Payment verification failed"
                };
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getPaymentHistory(userId: string): Promise<Payload> {
        try {
            const payments = await SubscriptionPayment.find({ user: userId })
                .populate('subscription')
                .sort({ createdAt: -1 });

            return {
                payload: payments,
                message: "Payment history retrieved successfully"
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async refundPayment(paymentId: string, reason: string): Promise<Payload> {
        try {
            const payment = await SubscriptionPayment.findById(paymentId);
            if (!payment) {
                throw new Error("Payment not found");
            }

            if (payment.status !== 'completed') {
                throw new Error("Only completed payments can be refunded");
            }

            // Process refund with payment gateway
            const refundResult = await this.processRefund(payment, reason);
            
            if (refundResult.success) {
                payment.status = 'refunded';
                payment.gatewayResponse = {
                    ...payment.gatewayResponse,
                    refund: refundResult
                };
                await payment.save();

                // Cancel subscription
                await this.subscriptionService.cancelSubscription(payment.user.toString());

                return {
                    payload: payment,
                    message: "Payment refunded successfully"
                };
            } else {
                throw new Error("Refund processing failed");
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private generatePaymentReference(): string {
        return `SUB_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    }

    private async generatePaymentUrl(payment: ISubscriptionPayment, planConfig: any): Promise<string> {
        // This is a placeholder implementation
        // In a real application, you would integrate with actual payment gateways like Paystack, Flutterwave, etc.
        
        const baseUrl = process.env.BASE_URL || 'http://localhost:3050';
        
        switch (payment.paymentMethod) {
            case 'paystack':
                // Integrate with Paystack
                return `${baseUrl}/payments/paystack/initialize?reference=${payment.paymentReference}`;
            
            case 'flutterwave':
                // Integrate with Flutterwave
                return `${baseUrl}/payments/flutterwave/initialize?reference=${payment.paymentReference}`;
            
            case 'card':
                // Direct card payment
                return `${baseUrl}/payments/card?reference=${payment.paymentReference}`;
            
            case 'bank_transfer':
                // Bank transfer instructions
                return `${baseUrl}/payments/bank-transfer?reference=${payment.paymentReference}`;
            
            default:
                return `${baseUrl}/payments/checkout?reference=${payment.paymentReference}`;
        }
    }

    private async verifyPaymentWithGateway(payment: ISubscriptionPayment): Promise<any> {
        // This is a placeholder implementation
        // In a real application, you would verify with the actual payment gateway
        
        // Simulate payment verification
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful payment verification
                resolve({
                    status: 'completed',
                    transactionId: `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
                    gatewayResponse: {
                        verified: true,
                        amount: payment.amount,
                        currency: payment.currency
                    }
                });
            }, 1000);
        });
    }

    private async processRefund(payment: ISubscriptionPayment, reason: string): Promise<any> {
        // This is a placeholder implementation
        // In a real application, you would process refund with the actual payment gateway
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    refundId: `REF_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
                    amount: payment.amount,
                    reason
                });
            }, 1000);
        });
    }
} 