import { Types } from "mongoose";
import InspectionRequest from "../models/inspectionRequest";
import Payment from "../models/payment";
import HostelRepository from "../repositories/HostelRepository";
import NotificationService from "./NotificationService";


class InspectionService {

    constructor(private readonly notificationService: NotificationService, private readonly hostelRepository: HostelRepository) {}

    async createInspectionRequest(user: string, hostelId: string, inspectionDate: Date) {
        const inspectionRequest = await InspectionRequest.create({ user, hostelId, inspectionDate });
         // Fetch the hostel to get the agent's information
         const hostel = await this.hostelRepository.findOne({_id: hostelId})
         if (!hostel) {
             throw new Error("Hostel not found");
         }
 
         // Create notification data for the agent
         const notificationData = {
             title: "New Inspection Request",
             message: `A new inspection request has been made for your hostel: ${hostel.hostelName}.`,
             actionLink: `/inspections/${inspectionRequest._id}`,
             user: hostel.user as Types.ObjectId // Assuming the agent field in the hostel model refers to the user who created it
         };
 
         // Send notification to the agent
         await this.notificationService.createNotification(notificationData);
 
        return {payload: inspectionRequest};
    }

    async makePayment(user: string, inspectionRequestId: string, amount: number) {
        //include logic to make actual payments here
        const payment = await Payment.create({ user, inspectionRequest: inspectionRequestId, amount });
        return {payload: payment};
    }
}

export default InspectionService;