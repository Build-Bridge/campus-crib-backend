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
exports.PaymentService = void 0;
const typedi_1 = require("typedi");
const subscriptionPayment_1 = __importDefault(require("../models/subscriptionPayment"));
const SubscriptionService_1 = require("./SubscriptionService");
const subscription_1 = require("../models/subscription");
const crypto_1 = __importDefault(require("crypto"));
let PaymentService = class PaymentService {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    initializePayment(userId, plan, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const planConfig = SubscriptionService_1.SUBSCRIPTION_PLANS[plan];
                if (!planConfig) {
                    throw new Error("Invalid subscription plan");
                }
                if (plan === subscription_1.SubscriptionPlan.BASIC) {
                    // Basic plan is free, create subscription directly
                    return yield this.subscriptionService.createSubscription(userId, plan);
                }
                // Generate payment reference
                const paymentReference = this.generatePaymentReference();
                // Create a temporary subscription record
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                const subscription = yield this.subscriptionService.createSubscription(userId, plan);
                // Create payment record
                const payment = yield subscriptionPayment_1.default.create({
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
                const paymentUrl = yield this.generatePaymentUrl(payment, planConfig);
                return {
                    payload: {
                        payment,
                        paymentUrl,
                        subscription: subscription.payload
                    },
                    message: "Payment initialized successfully"
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    verifyPayment(paymentReference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield subscriptionPayment_1.default.findOne({ paymentReference });
                if (!payment) {
                    throw new Error("Payment not found");
                }
                // Verify payment with payment gateway
                const verificationResult = yield this.verifyPaymentWithGateway(payment);
                if (verificationResult.status === 'completed') {
                    payment.status = 'completed';
                    payment.transactionId = verificationResult.transactionId;
                    payment.gatewayResponse = verificationResult.gatewayResponse;
                    yield payment.save();
                    // Update subscription status
                    yield this.subscriptionService.activateSubscription(payment.subscription.toString());
                    return {
                        payload: payment,
                        message: "Payment verified and subscription activated"
                    };
                }
                else {
                    payment.status = 'failed';
                    payment.gatewayResponse = verificationResult.gatewayResponse;
                    yield payment.save();
                    return {
                        payload: payment,
                        message: "Payment verification failed"
                    };
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getPaymentHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield subscriptionPayment_1.default.find({ user: userId })
                    .populate('subscription')
                    .sort({ createdAt: -1 });
                return {
                    payload: payments,
                    message: "Payment history retrieved successfully"
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    refundPayment(paymentId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield subscriptionPayment_1.default.findById(paymentId);
                if (!payment) {
                    throw new Error("Payment not found");
                }
                if (payment.status !== 'completed') {
                    throw new Error("Only completed payments can be refunded");
                }
                // Process refund with payment gateway
                const refundResult = yield this.processRefund(payment, reason);
                if (refundResult.success) {
                    payment.status = 'refunded';
                    payment.gatewayResponse = Object.assign(Object.assign({}, payment.gatewayResponse), { refund: refundResult });
                    yield payment.save();
                    // Cancel subscription
                    yield this.subscriptionService.cancelSubscription(payment.user.toString());
                    return {
                        payload: payment,
                        message: "Payment refunded successfully"
                    };
                }
                else {
                    throw new Error("Refund processing failed");
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    generatePaymentReference() {
        return `SUB_${Date.now()}_${crypto_1.default.randomBytes(8).toString('hex')}`;
    }
    generatePaymentUrl(payment, planConfig) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    verifyPaymentWithGateway(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a placeholder implementation
            // In a real application, you would verify with the actual payment gateway
            // Simulate payment verification
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Simulate successful payment verification
                    resolve({
                        status: 'completed',
                        transactionId: `TXN_${Date.now()}_${crypto_1.default.randomBytes(4).toString('hex')}`,
                        gatewayResponse: {
                            verified: true,
                            amount: payment.amount,
                            currency: payment.currency
                        }
                    });
                }, 1000);
            });
        });
    }
    processRefund(payment, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a placeholder implementation
            // In a real application, you would process refund with the actual payment gateway
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        refundId: `REF_${Date.now()}_${crypto_1.default.randomBytes(4).toString('hex')}`,
                        amount: payment.amount,
                        reason
                    });
                }, 1000);
            });
        });
    }
};
PaymentService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [SubscriptionService_1.SubscriptionService])
], PaymentService);
exports.PaymentService = PaymentService;
