
import Users, { IUser } from "../models/user";
import { BaseRepository } from "./BaseRepository";
import { Service } from "typedi";

@Service()
class UserRepository extends BaseRepository<IUser>{
    constructor(){
        super(Users)
    }

    async updateBookmark(userId: string, hostelId: string, action: "add" | "remove"): Promise<IUser | null> {
        const update = action === "add" 
            ? { $addToSet: { bookmarkedHostels: hostelId } } // Add hostel
            : { $pull: { bookmarkedHostels: hostelId } };    // Remove hostel

        return await Users.findByIdAndUpdate(userId, update, { new: true }).populate("bookmarkedHostels");
    }

}

export default UserRepository