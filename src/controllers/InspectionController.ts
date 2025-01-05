import { Request, Response } from "express";
import InspectionService from "../services/InspectionService";
import { errorResponse, successResponse } from "../utils/response";


class InspectionController {
    private inspectionService: InspectionService;

    constructor(inspectionService: InspectionService) {
        this.inspectionService = inspectionService;
    }

    async requestInspection(req: Request, res: Response) {
        try {
            const { hostel, inspectionDate } = req.body;
            const user = req.body.user; // From verifyAuth middleware
            const response = await this.inspectionService.createInspectionRequest(user, hostel, new Date(inspectionDate));
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async makePayment(req: Request, res: Response) {
        try {
            const { inspectionRequestId, amount } = req.body;
            const user = req.body.user; // From verifyAuth middleware
            const response = await this.inspectionService.makePayment(user, inspectionRequestId, amount);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default InspectionController;