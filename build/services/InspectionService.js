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
const inspectionRequest_1 = __importDefault(require("../models/inspectionRequest"));
const payment_1 = __importDefault(require("../models/payment"));
const HostelRepository_1 = __importDefault(require("../repositories/HostelRepository"));
const NotificationService_1 = __importDefault(require("./NotificationService"));
const typedi_1 = require("typedi");
let InspectionService = class InspectionService {
    constructor(notificationService, hostelRepository) {
        this.notificationService = notificationService;
        this.hostelRepository = hostelRepository;
    }
    createInspectionRequest(user, hostelId, inspectionDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const inspectionRequest = yield inspectionRequest_1.default.create({ user, hostelId, inspectionDate });
            // Fetch the hostel to get the agent's information
            const hostel = yield this.hostelRepository.findOne({ _id: hostelId });
            if (!hostel) {
                throw new Error("Hostel not found");
            }
            // Create notification data for the agent
            const notificationData = {
                title: "New Inspection Request",
                message: `A new inspection request has been made for your hostel: ${hostel.hostelName}.`,
                actionLink: `/inspections/${inspectionRequest._id}`,
                user: hostel.user // Assuming the agent field in the hostel model refers to the user who created it
            };
            // Send notification to the agent
            yield this.notificationService.createNotification(notificationData);
            return { payload: inspectionRequest };
        });
    }
    makePayment(user, inspectionRequestId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            //include logic to make actual payments here
            const payment = yield payment_1.default.create({ user, inspectionRequest: inspectionRequestId, amount });
            return { payload: payment };
        });
    }
};
InspectionService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [NotificationService_1.default, HostelRepository_1.default])
], InspectionService);
exports.default = InspectionService;
