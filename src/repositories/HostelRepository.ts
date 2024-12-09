import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import Hostels, { IHostel } from "../models/hostel";


@Service()
class HostelRepository extends BaseRepository<IHostel>{
    constructor(){
        super(Hostels)
    }
}

export default HostelRepository