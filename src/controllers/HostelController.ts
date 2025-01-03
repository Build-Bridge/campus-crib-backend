import { Service } from "typedi";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import HostelServices from "../services/HostelServices";

@Service()
class HostelController {
    constructor(private readonly service: HostelServices) {}

    // Create a new hostel
    async createHostel(req: Request, res: Response) {
        try {
            const data = req.body;
            const response = await this.service.createHostel(data);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    // Get all hostels with optional query parameters
    async getAllHostels(req: Request, res: Response) {
        try {
            const query = req.query;
            const response = await this.service.getAllHostels(query);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    // Get a single hostel by ID
    async getHostelById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const response = await this.service.getHostelById(id);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    // Update a hostel by ID
    async updateHostel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            const response = await this.service.updateHostel(id, data);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    // Delete a hostel by ID
    async deleteHostel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = req.body.user
            const response = await this.service.deleteHostel(id, user);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default HostelController;
