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
exports.SubscriptionController = void 0;
const typedi_1 = require("typedi");
const SubscriptionService_1 = require("../services/SubscriptionService");
const response_1 = require("../utils/response");
const subscription_1 = require("../models/subscription");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    createSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { plan } = req.body;
                const userId = req.body.user; // From verifyAuth middleware
                if (!plan || !Object.values(subscription_1.SubscriptionPlan).includes(plan)) {
                    (0, response_1.errorResponse)("Invalid subscription plan", res);
                    return;
                }
                const response = yield this.subscriptionService.createSubscription(userId, plan);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    cancelSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // From verifyAuth middleware
                const response = yield this.subscriptionService.cancelSubscription(userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getUserSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // From verifyAuth middleware
                const response = yield this.subscriptionService.getUserSubscription(userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getSubscriptionFeatures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // From verifyAuth middleware
                const response = yield this.subscriptionService.getSubscriptionFeatures(userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getAvailablePlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.subscriptionService.getAvailablePlans();
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    upgradeSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { plan } = req.body;
                const userId = req.body.user; // From verifyAuth middleware
                if (!plan || !Object.values(subscription_1.SubscriptionPlan).includes(plan)) {
                    (0, response_1.errorResponse)("Invalid subscription plan", res);
                    return;
                }
                const response = yield this.subscriptionService.upgradeSubscription(userId, plan);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    checkSubscriptionLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // From verifyAuth middleware
                const response = yield this.subscriptionService.checkSubscriptionLimit(userId);
                (0, response_1.successResponse)({ payload: response }, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
};
SubscriptionController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [SubscriptionService_1.SubscriptionService])
], SubscriptionController);
exports.SubscriptionController = SubscriptionController;
