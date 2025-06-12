import { Service } from "typedi";
import { Request, Response } from "express";
import RoommateRequestService from "../services/RoomateRequestService";
import { errorResponse, successResponse } from "../utils/response";

@Service()
class RoommateRequestController {
    constructor(private readonly service: RoommateRequestService) {}

    async createRoommateRequest(req: Request, res: Response) {
        try {
            const data = {
                ...req.body,
                userId: req.body.user // Retrieved from verifyAuth middleware
            };
            const response = await this.service.createRoommateRequest(data);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getAllRoommateRequests(req: Request, res: Response) {
        try {
            const response = await this.service.getAllRoommateRequests(req.query);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getRoommateRequestById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const response = await this.service.getRoommateRequestById(id);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async addComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.body.user; // Retrieved from verifyAuth middleware
            const { content } = req.body;

            if (!content) {
                throw new Error("Comment content is required");
            }

            const response = await this.service.addComment(id, userId, content);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async updateRoommateRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.body.user; // Retrieved from verifyAuth middleware
            const data = req.body;

            const response = await this.service.updateRoommateRequest(id, userId, data);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async deleteRoommateRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.body.user; // Retrieved from verifyAuth middleware

            const response = await this.service.deleteRoommateRequest(id, userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default RoommateRequestController;
