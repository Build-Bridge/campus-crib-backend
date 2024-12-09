import { Service } from "typedi";
import { Request, Response } from "express"
import { UserServices } from "../services/UserServices";
import { errorResponse, successResponse } from "../utils/response";


@Service()
class UserController{
    constructor(private readonly service : UserServices){
    }

    async signUp(req: Request, res: Response){
        try{
            let data = req.body;
            let response = await this.service.signUp(data);
             successResponse(response, res)
        }
        catch(err: any){
             errorResponse(err.message, res);
        }
    }

    async signIn(req: Request, res: Response){
        try{
            let data = req.body;
            let response = await this.service.signIn(data);
             successResponse(response, res)
        }
        catch(err: any){
             errorResponse(err.message, res);
        }
    }

    async completeProfile(req: Request, res: Response){
        try{
            let data = req.body;
            let user = req.body.user;
            let response = await this.service.completeProfile(user, data);
             successResponse(response, res)
        }
        catch(err: any){
             errorResponse(err.message, res);
        }
    }
}

export default UserController