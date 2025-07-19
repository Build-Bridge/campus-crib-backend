import { Service } from "typedi";
import HostelRepository from "../repositories/HostelRepository";
import { IHostel } from "../models/hostel";
import NotificationRepository from "../repositories/NotificationRepository";
import NotificationService from "./NotificationService";


@Service()
class HostelServices {
    constructor(private readonly repository: HostelRepository, private readonly notificationService: NotificationService) {}

    // Create a new hostel
    async createHostel(data: Partial<IHostel>) {
        try {
            const createdHostel = await this.repository.create(data);

             // Create notification data
             const notificationData = {
                title: "New Hostel Available",
                message: `A new hostel named ${createdHostel.hostelName} at ${createdHostel.location} has been added.`,
                actionLink: `/hostels/${createdHostel._id}`
            };

            // Send notifications to all basic users
            await this.notificationService.sendNotificationToBasicUsers(notificationData);

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

            // Add search functionality across all fields
            if (query.query) {
                const searchRegex = { $regex: query.query, $options: "i" };
                filters.$or = [
                    { hostelName: searchRegex },
                    { description: searchRegex },
                    { location: searchRegex },
                    { hostelType: searchRegex },
                    { features: searchRegex }
                ];
            }

            // Add filters based on query parameters
            if (query.hostelName) filters.hostelName = { $regex: query.hostelName, $options: "i" };
            if (query.location) filters.location = { $regex: query.location, $options: "i" };
            if (query.hostelType) filters.hostelType = query.hostelType;
            if (query.isAvailable !== undefined) filters.isAvailable = query.isAvailable === "true";
            
            if (query.minPrice || query.maxPrice) {
                const priceConditions: any[] = [];
            
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

    // Fetch recommended hostels: location in Harmony, Kofesu, Accord (regex), price < 200000
    async getRecommendedHostels() {
        try {
            const filters: any = {
                location: { $regex: /(Harmony|Kofesu|Accord)/i },
                price: { $lt: 200000 }
            };
            const hostels = await this.repository.find(filters);
            return {
                payload: hostels,
                message: "Recommended Hostels Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Fetch nearby hostels: location in Harmony, Kofesu, Accord (regex)
    async getNearbyHostels() {
        try {
            const filters: any = {
                location: { $regex: /(Harmony|Kofesu|Accord)/i }
            };
            const hostels = await this.repository.find(filters);
            return {
                payload: hostels,
                message: "Nearby Hostels Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Fetch affordable hostels: price < 170000
    async getAffordableHostels() {
        try {
            const filters: any = {
                price: { $lt: 170000 }
            };
            const hostels = await this.repository.find(filters);
            return {
                payload: hostels,
                message: "Affordable Hostels Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Promote hostel (subscription feature)
    async promoteHostel(id: string) {
        try {
            const hostel = await this.repository.findOne({ _id: id });
            if (!hostel) {
                throw new Error("Hostel not found");
            }

            hostel.isPriorityListing = true;
            const updatedHostel = await this.repository.update({ _id: id }, hostel);
            
            return {
                payload: updatedHostel,
                message: "Hostel promoted successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Feature hostel (subscription feature)
    async featureHostel(id: string) {
        try {
            const hostel = await this.repository.findOne({ _id: id });
            if (!hostel) {
                throw new Error("Hostel not found");
            }

            hostel.isFeatured = true;
            const updatedHostel = await this.repository.update({ _id: id }, hostel);
            
            return {
                payload: updatedHostel,
                message: "Hostel featured successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get hostel analytics (subscription feature)
    async getHostelAnalytics(id: string) {
        try {
            const hostel = await this.repository.findOne({ _id: id });
            if (!hostel) {
                throw new Error("Hostel not found");
            }

            const analytics = {
                hostelId: hostel._id,
                hostelName: hostel.hostelName,
                views: hostel.views || 0,
                inquiries: hostel.inquiries || 0,
                createdAt: hostel.createdAt,
                isPriorityListing: hostel.isPriorityListing,
                isFeatured: hostel.isFeatured
            };
            
            return {
                payload: analytics,
                message: "Hostel analytics retrieved successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Fetch premium picks hostels: location in Harmony or Accord (regex), price >= 300000
    async getPremiumPicks() {
        try {
            const filters: any = {
                location: { $regex: /(Harmony|Accord)/i },
                price: { $gte: 300000 }
            };
            const hostels = await this.repository.find(filters);
            return {
                payload: hostels,
                message: "Premium Picks Retrieved Successfully",
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default HostelServices;
