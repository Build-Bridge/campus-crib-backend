import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { SubscriptionService } from "../services/SubscriptionService";
import { errorResponse } from "../utils/response";

export const checkSubscriptionLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.user; // From verifyAuth middleware
        const subscriptionService = Container.get(SubscriptionService);
        
        const { canCreate, currentCount, maxAllowed } = await subscriptionService.checkSubscriptionLimit(userId);
        
        if (!canCreate) {
            errorResponse(
                `You have reached your hostel limit. Current: ${currentCount}, Maximum allowed: ${maxAllowed === Infinity ? 'Unlimited' : maxAllowed}. Please upgrade your subscription to add more hostels.`,
                res
            );
            return;
        }
        
        next();
    } catch (error: any) {
        errorResponse(error.message, res);
        return;
    }
};

export const checkSubscriptionFeature = (feature: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const subscriptionService = Container.get(SubscriptionService);
            
            const { payload: features } = await subscriptionService.getSubscriptionFeatures(userId);
            
            if (!features || !features[feature]) {
                errorResponse(
                    `This feature requires a higher subscription plan. Please upgrade to access ${feature}.`,
                    res
                );
                return;
            }
            
            next();
        } catch (error: any) {
            errorResponse(error.message, res);
            return;
        }
    };
};

export const requireActiveSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.user; // From verifyAuth middleware
        const subscriptionService = Container.get(SubscriptionService);
        
        const { payload: subscription } = await subscriptionService.getUserSubscription(userId);
        
        if (!subscription) {
            errorResponse(
                "This action requires an active subscription. Please subscribe to a plan to continue.",
                res
            );
            return;
        }
        
        next();
    } catch (error: any) {
        errorResponse(error.message, res);
        return;
    }
}; 