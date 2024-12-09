
import Users, { IUser } from "../models/user";
import { BaseRepository } from "./BaseRepository";
import { Service } from "typedi";

@Service()
class UserRepository extends BaseRepository<IUser>{
    constructor(){
        super(Users)
    }
}

export default UserRepository