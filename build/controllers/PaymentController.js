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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const typedi_1 = require("typedi");
const PaymentService_1 = require("../services/PaymentService");
const response_1 = require("../utils/response");
const subscription_1 = require("../models/subscription");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    initializePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { plan, paymentMethod } = req.body;
                const userId = req.body.user; // From verifyAuth middleware
                if (!plan || !Object.values(subscription_1.SubscriptionPlan).includes(plan)) {
                    (0, response_1.errorResponse)("Invalid subscription plan", res);
                    return;
                }
                if (!paymentMethod) {
                    (0, response_1.errorResponse)("Payment method is required", res);
                    return;
                }
                const response = yield this.paymentService.initializePayment(userId, plan, paymentMethod);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentReference } = req.params;
                if (!paymentReference) {
                    (0, response_1.errorResponse)("Payment reference is required", res);
                    return;
                }
                const response = yield this.paymentService.verifyPayment(paymentReference);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getPaymentHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // From verifyAuth middleware
                const response = yield this.paymentService.getPaymentHistory(userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    refundPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentId } = req.params;
                const { reason } = req.body;
                const userId = req.body.user; // From verifyAuth middleware
                if (!paymentId) {
                    (0, response_1.errorResponse)("Payment ID is required", res);
                    return;
                }
                if (!reason) {
                    (0, response_1.errorResponse)("Refund reason is required", res);
                    return;
                }
                const response = yield this.paymentService.refundPayment(paymentId, reason);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
};
PaymentController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [PaymentService_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
