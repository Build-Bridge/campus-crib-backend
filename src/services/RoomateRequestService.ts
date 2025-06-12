import { Service } from "typedi";
import RoommateRequestRepository from "../repositories/RoommateRequestRepository";
import { IRoommateRequest } from "../models/RoommateRequest";
import NotificationService from "./NotificationService";
import { Types } from "mongoose";

@Service()
class RoommateRequestService {
    constructor(
        private readonly repository: RoommateRequestRepository,
        private readonly notificationService: NotificationService
    ) {}

    // Create a new roommate request
    async createRoommateRequest(data: Partial<IRoommateRequest>) {
        try {
            const createdRequest = await this.repository.create(data);

            // Create notification data
            const notificationData = {
                title: "New Roommate Request",
                message: `${createdRequest.name} is looking for a roommate in ${createdRequest.department}`,
                actionLink: `/roommate-requests/${createdRequest._id}`
            };

            // Send notifications to all basic users
            await this.notificationService.sendNotificationToBasicUsers(notificationData);

            return {
                payload: createdRequest,
                message: "Roommate Request Created Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get all roommate requests with optional filters
    async getAllRoommateRequests(query: any) {
        try {
            const filters: any = {};

            // Add filters based on query parameters
            if (query.department) filters.department = { $regex: query.department, $options: "i" };
            if (query.level) filters.level = query.level;
            if (query.sex) filters.sex = query.sex;
            if (query.religion) filters.religion = { $regex: query.religion, $options: "i" };
            
            const requests = await this.repository.model.find(filters)
                .populate('userId', 'name email')
                .populate('hostelId', 'name')
                .sort({ createdAt: -1 })
                .exec();

            return {
                payload: requests,
                message: "Roommate Requests Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get a specific roommate request by ID
    async getRoommateRequestById(id: string) {
        try {
            const request = await this.repository.model.findById(id)
                .populate('userId', 'name email')
                .populate('hostelId', 'name')
                .populate('comments.userId', 'name email')
                .exec();

            if (!request) {
                throw new Error("Roommate request not found");
            }

            return {
                payload: request,
                message: "Roommate Request Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Add a comment to a roommate request
    async addComment(requestId: string, userId: string, content: string) {
        try {
            const request = await this.repository.findOne({ _id: requestId });
            
            if (!request) {
                throw new Error("Roommate request not found");
            }

            request.comments.push({
                userId: new Types.ObjectId(userId),
                content,
                createdAt: new Date()
            });

            await request.save();

            // Create notification for the request owner
            const notificationData = {
                title: "New Comment on Your Roommate Request",
                message: "Someone commented on your roommate request",
                actionLink: `/roommate-requests/${requestId}`,
                user: request.userId
            };

            await this.notificationService.createNotification(notificationData);

            return {
                payload: request,
                message: "Comment Added Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Update a roommate request
    async updateRoommateRequest(id: string, userId: string, data: Partial<IRoommateRequest>) {
        try {
            const request = await this.repository.findOne({ _id: id });
            
            if (!request) {
                throw new Error("Roommate request not found");
            }

            if (request.userId.toString() !== userId) {
                throw new Error("Not authorized to update this request");
            }

            const updatedRequest = await this.repository.update({ _id: id }, data);

            return {
                payload: updatedRequest,
                message: "Roommate Request Updated Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Delete a roommate request
    async deleteRoommateRequest(id: string, userId: string) {
        try {
            const request = await this.repository.findOne({ _id: id });
            
            if (!request) {
                throw new Error("Roommate request not found");
            }

            if (request.userId.toString() !== userId) {
                throw new Error("Not authorized to delete this request");
            }

            const deletedRequest = await this.repository.delete({ _id: id });

            return {
                payload: deletedRequest,
                message: "Roommate Request Deleted Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default RoommateRequestService;
