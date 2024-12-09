import { Service } from "typedi";
import HostelRepository from "../repositories/HostelRepository";
import { IHostel } from "../models/hostel";

@Service()
class HostelServices {
    constructor(private readonly repository : HostelRepository){}

    async createHostel(data: Partial<IHostel>){
        try{
            let createdHostel = await this.repository.create(data);
            return{
                data: createdHostel,
                message:"Hostel Created Successfully"
            }
        }
        catch(err: any){
            throw new Error(err.message);
        }
    }
}

export default HostelServices