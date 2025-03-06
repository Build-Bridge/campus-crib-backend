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
const HostelRepository_1 = __importDefault(require("../repositories/HostelRepository"));
const NotificationService_1 = __importDefault(require("./NotificationService"));
let HostelServices = class HostelServices {
    constructor(repository, notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    // Create a new hostel
    createHostel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdHostel = yield this.repository.create(data);
                // Create notification data
                const notificationData = {
                    title: "New Hostel Available",
                    message: `A new hostel named ${createdHostel.hostelName} at ${createdHostel.location} has been added.`,
                    actionLink: `/hostels/${createdHostel._id}`
                };
                // Send notifications to all basic users
                yield this.notificationService.sendNotificationToBasicUsers(notificationData);
                return {
                    payload: createdHostel,
                    message: "Hostel Created Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Fetch all hostels with optional query params
    getAllHostels(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {};
                // Add filters based on query parameters
                if (query.hostelName)
                    filters.hostelName = { $regex: query.hostelName, $options: "i" };
                if (query.location)
                    filters.location = { $regex: query.location, $options: "i" };
                if (query.hostelType)
                    filters.hostelType = query.hostelType;
                if (query.isAvailable !== undefined)
                    filters.isAvailable = query.isAvailable === "true";
                if (query.minPrice || query.maxPrice) {
                    const priceConditions = [];
                    if (query.minPrice) {
                        priceConditions.push({
                            $gte: [{ $toDouble: "$price" }, Number(query.minPrice)]
                        });
                    }
                    if (query.maxPrice) {
                        priceConditions.push({
                            $lte: [{ $toDouble: "$price" }, Number(query.maxPrice)]
                        });
                    }
                    if (priceConditions.length > 0) {
                        filters.$expr = { $and: priceConditions };
                    }
                }
                const hostels = yield this.repository.find(filters);
                return {
                    payload: hostels,
                    message: "Hostels Retrieved Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Fetch details of a single hostel by ID
    getHostelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hostel = yield this.repository.findOne({ _id: id });
                if (!hostel) {
                    throw new Error("Hostel not found");
                }
                return {
                    payload: hostel,
                    message: "Hostel Retrieved Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Update a hostel by ID
    updateHostel(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedHostel = yield this.repository.update({ _id: id }, data);
                if (!updatedHostel) {
                    throw new Error("Hostel not found or update failed");
                }
                return {
                    payload: updatedHostel,
                    message: "Hostel Updated Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    // Delete a hostel by ID
    deleteHostel(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedHostel = yield this.repository.delete({ _id: id });
                if (!deletedHostel) {
                    throw new Error("Hostel not found or deletion failed");
                }
                return {
                    payload: deletedHostel,
                    message: "Hostel Deleted Successfully",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
};
HostelServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [HostelRepository_1.default, NotificationService_1.default])
], HostelServices);
exports.default = HostelServices;
