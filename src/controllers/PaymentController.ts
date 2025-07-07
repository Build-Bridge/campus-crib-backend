import { Request, Response } from "express";
import { Service } from "typedi";
import { PaymentService } from "../services/PaymentService";
import { errorResponse, successResponse } from "../utils/response";
import { SubscriptionPlan } from "../models/subscription";

@Service()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    async initializePayment(req: Request, res: Response) {
        try {
            const { plan, paymentMethod } = req.body;
            const userId = req.body.user; // From verifyAuth middleware

            if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
                errorResponse("Invalid subscription plan", res);
                return;
            }

            if (!paymentMethod) {
                errorResponse("Payment method is required", res);
                return;
            }

            const response = await this.paymentService.initializePayment(userId, plan, paymentMethod);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const { paymentReference } = req.params;
            
            if (!paymentReference) {
                errorResponse("Payment reference is required", res);
                return;
            }

            const response = await this.paymentService.verifyPayment(paymentReference);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getPaymentHistory(req: Request, res: Response) {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const response = await this.paymentService.getPaymentHistory(userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async refundPayment(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const { reason } = req.body;
            const userId = req.body.user; // From verifyAuth middleware

            if (!paymentId) {
                errorResponse("Payment ID is required", res);
                return;
            }

            if (!reason) {
                errorResponse("Refund reason is required", res);
                return;
            }

            const response = await this.paymentService.refundPayment(paymentId, reason);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
} 