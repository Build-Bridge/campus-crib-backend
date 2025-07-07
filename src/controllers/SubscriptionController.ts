import { Request, Response } from "express";
import { Service } from "typedi";
import { SubscriptionService } from "../services/SubscriptionService";
import { errorResponse, successResponse } from "../utils/response";
import { SubscriptionPlan } from "../models/subscription";

@Service()
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    async createSubscription(req: Request, res: Response) {
        try {
            const { plan } = req.body;
            const userId = req.body.user; // From verifyAuth middleware

            if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
                errorResponse("Invalid subscription plan", res);
                return;
            }

            const response = await this.subscriptionService.createSubscription(userId, plan);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async cancelSubscription(req: Request, res: Response) {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const response = await this.subscriptionService.cancelSubscription(userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getUserSubscription(req: Request, res: Response) {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const response = await this.subscriptionService.getUserSubscription(userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getSubscriptionFeatures(req: Request, res: Response) {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const response = await this.subscriptionService.getSubscriptionFeatures(userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getAvailablePlans(req: Request, res: Response) {
        try {
            const response = await this.subscriptionService.getAvailablePlans();
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async upgradeSubscription(req: Request, res: Response) {
        try {
            const { plan } = req.body;
            const userId = req.body.user; // From verifyAuth middleware

            if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
                errorResponse("Invalid subscription plan", res);
                return;
            }

            const response = await this.subscriptionService.upgradeSubscription(userId, plan);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async checkSubscriptionLimit(req: Request, res: Response) {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const response = await this.subscriptionService.checkSubscriptionLimit(userId);
            successResponse({ payload: response }, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
} 