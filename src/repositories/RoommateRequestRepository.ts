import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import RoommateRequest, { IRoommateRequest } from "../models/RoommateRequest";

@Service()
class RoommateRequestRepository extends BaseRepository<IRoommateRequest> {
    constructor() {
        super(RoommateRequest);
    }
}

export default RoommateRequestRepository; 