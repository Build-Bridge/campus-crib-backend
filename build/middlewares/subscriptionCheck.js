"use strict";
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
exports.requireActiveSubscription = exports.checkSubscriptionFeature = exports.checkSubscriptionLimit = void 0;
const typedi_1 = require("typedi");
const SubscriptionService_1 = require("../services/SubscriptionService");
const response_1 = require("../utils/response");
const checkSubscriptionLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user; // From verifyAuth middleware
        const subscriptionService = typedi_1.Container.get(SubscriptionService_1.SubscriptionService);
        const { canCreate, currentCount, maxAllowed } = yield subscriptionService.checkSubscriptionLimit(userId);
        if (!canCreate) {
            (0, response_1.errorResponse)(`You have reached your hostel limit. Current: ${currentCount}, Maximum allowed: ${maxAllowed === Infinity ? 'Unlimited' : maxAllowed}. Please upgrade your subscription to add more hostels.`, res);
            return;
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(error.message, res);
        return;
    }
});
exports.checkSubscriptionLimit = checkSubscriptionLimit;
const checkSubscriptionFeature = (feature) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const subscriptionService = typedi_1.Container.get(SubscriptionService_1.SubscriptionService);
            const { payload: features } = yield subscriptionService.getSubscriptionFeatures(userId);
            if (!features || !features[feature]) {
                (0, response_1.errorResponse)(`This feature requires a higher subscription plan. Please upgrade to access ${feature}.`, res);
                return;
            }
            next();
        }
        catch (error) {
            (0, response_1.errorResponse)(error.message, res);
            return;
        }
    });
};
exports.checkSubscriptionFeature = checkSubscriptionFeature;
const requireActiveSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user; // From verifyAuth middleware
        const subscriptionService = typedi_1.Container.get(SubscriptionService_1.SubscriptionService);
        const { payload: subscription } = yield subscriptionService.getUserSubscription(userId);
        if (!subscription) {
            (0, response_1.errorResponse)("This action requires an active subscription. Please subscribe to a plan to continue.", res);
            return;
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(error.message, res);
        return;
    }
});
exports.requireActiveSubscription = requireActiveSubscription;
