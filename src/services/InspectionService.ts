import InspectionRequest from "../models/inspectionRequest";
import Payment from "../models/payment";


class InspectionService {
    async createInspectionRequest(user: string, hostel: string, inspectionDate: Date) {
        const inspectionRequest = await InspectionRequest.create({ user, hostel, inspectionDate });
        return {payload: inspectionRequest};
    }

    async makePayment(user: string, inspectionRequestId: string, amount: number) {
        //include logic to make actual payments here
        const payment = await Payment.create({ user, inspectionRequest: inspectionRequestId, amount });
        return {payload: payment};
    }
}

export default InspectionService;