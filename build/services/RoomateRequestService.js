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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const RoommateRequestRepository_1 = __importDefault(require("../repositories/RoommateRequestRepository"));
const NotificationService_1 = __importDefault(require("./NotificationService"));
const mongoose_1 = require("mongoose");
let RoommateRequestService = class RoommateRequestService {
    constructor(repository, notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    // Create a new roommate request
    createRoommateRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdRequest = yield this.repository.create(data);
                // Create notification data
                const notificationData = {
                    title: "New Roommate Request",
                    message: `${createdRequest.name} is looking for a roommate in ${createdRequest.department}`,
                    actionLink: `/roommate-requests/${createdRequest._id}`
                };
                // Send notifications to all basic users
                yield this.notificationService.sendNotificationToBasicUsers(notificationData);
                return {
                    payload: createdRequest,
                    message: "Roommate Request Created Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Get all roommate requests with optional filters
    getAllRoommateRequests(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {};
                // Add filters based on query parameters
                if (query.department)
                    filters.department = { $regex: query.department, $options: "i" };
                if (query.level)
                    filters.level = query.level;
                if (query.sex)
                    filters.sex = query.sex;
                if (query.religion)
                    filters.religion = { $regex: query.religion, $options: "i" };
                const requests = yield this.repository.model.find(filters)
                    .populate('userId', 'name email')
                    .populate('hostelId', 'name')
                    .sort({ createdAt: -1 })
                    .exec();
                return {
                    payload: requests,
                    message: "Roommate Requests Retrieved Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Get a specific roommate request by ID
    getRoommateRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield this.repository.model.findById(id)
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
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Add a comment to a roommate request
    addComment(requestId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield this.repository.findOne({ _id: requestId });
                if (!request) {
                    throw new Error("Roommate request not found");
                }
                request.comments.push({
                    userId: new mongoose_1.Types.ObjectId(userId),
                    content,
                    createdAt: new Date()
                });
                yield request.save();
                // Create notification for the request owner
                const notificationData = {
                    title: "New Comment on Your Roommate Request",
                    message: "Someone commented on your roommate request",
                    actionLink: `/roommate-requests/${requestId}`,
                    user: request.userId
                };
                yield this.notificationService.createNotification(notificationData);
                return {
                    payload: request,
                    message: "Comment Added Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Update a roommate request
    updateRoommateRequest(id, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield this.repository.findOne({ _id: id });
                if (!request) {
                    throw new Error("Roommate request not found");
                }
                if (request.userId.toString() !== userId) {
                    throw new Error("Not authorized to update this request");
                }
                const updatedRequest = yield this.repository.update({ _id: id }, data);
                return {
                    payload: updatedRequest,
                    message: "Roommate Request Updated Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Delete a roommate request
    deleteRoommateRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield this.repository.findOne({ _id: id });
                if (!request) {
                    throw new Error("Roommate request not found");
                }
                if (request.userId.toString() !== userId) {
                    throw new Error("Not authorized to delete this request");
                }
                const deletedRequest = yield this.repository.delete({ _id: id });
                return {
                    payload: deletedRequest,
                    message: "Roommate Request Deleted Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
};
RoommateRequestService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [RoommateRequestRepository_1.default,
        NotificationService_1.default])
], RoommateRequestService);
exports.default = RoommateRequestService;
