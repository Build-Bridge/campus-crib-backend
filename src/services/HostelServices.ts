import { Service } from "typedi";
import HostelRepository from "../repositories/HostelRepository";
import { IHostel } from "../models/hostel";

@Service()
class HostelServices {
    constructor(private readonly repository: HostelRepository) {}

    // Create a new hostel
    async createHostel(data: Partial<IHostel>) {
        try {
            const createdHostel = await this.repository.create(data);
            return {
                payload: createdHostel,
                message: "Hostel Created Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Fetch all hostels with optional query params
    async getAllHostels(query: any) {
        try {
            const filters: any = {};
            
            // Add filters based on query parameters
            if (query.hostelName) filters.hostelName = { $regex: query.hostelName, $options: "i" };
            if (query.location) filters.location = { $regex: query.location, $options: "i" };
            if (query.hostelType) filters.hostelType = query.hostelType;
            if (query.isAvailable !== undefined) filters.isAvailable = query.isAvailable === "true";
            if (query.minPrice || query.maxPrice) {
                filters.price = {};
                if (query.minPrice) filters.price.$gte = query.minPrice;
                if (query.maxPrice) filters.price.$lte = query.maxPrice;
            }

            const hostels = await this.repository.find(filters);
            return {
                payload: hostels,
                message: "Hostels Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Fetch details of a single hostel by ID
    async getHostelById(id: string) {
        try {
            const hostel = await this.repository.findOne({_id: id});
            if (!hostel) {
                throw new Error("Hostel not found");
            }
            return {
                payload: hostel,
                message: "Hostel Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Update a hostel by ID
    async updateHostel(id: string, data: Partial<IHostel>) {
        try {
            const updatedHostel = await this.repository.update({_id: id}, data);
            if (!updatedHostel) {
                throw new Error("Hostel not found or update failed");
            }
            return {
                payload: updatedHostel,
                message: "Hostel Updated Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Delete a hostel by ID
    async deleteHostel(id: string, user: string) {
        try {
            const deletedHostel = await this.repository.delete({_id: id});
            if (!deletedHostel) {
                throw new Error("Hostel not found or deletion failed");
            }
            return {
                payload: deletedHostel,
                message: "Hostel Deleted Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default HostelServices;
