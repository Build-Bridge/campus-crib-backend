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
            console.log(response)
            successResponse(response, res)
        }
        catch(err: any){
            console.log(err)
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
            console.log(data)
            let user = req.body.user;
            let response = await this.service.completeProfile(user, data);
             successResponse(response, res)
        }
        catch(err: any){
             errorResponse(err.message, res);
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            
            if (!email) {
                throw new Error("Email is required");
            }

            const response = await this.service.forgotPassword(email);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { resetToken, newPassword } = req.body;
            
            if (!resetToken || !newPassword) {
                throw new Error("Reset token and new password are required");
            }

            if (newPassword.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }

            const response = await this.service.resetPassword(resetToken, newPassword);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async updateBookmark(req: Request, res: Response) {
        try {
            const userId = req.body.user; // Retrieved from `verifyAuth` middleware
            const { hostelId, action } = req.body;

            if (!["add", "remove"].includes(action)) {
                throw new Error("Invalid action. Use 'add' or 'remove'.");
            }

            const bookmarks = await this.service.updateBookmark(userId, hostelId, action as "add" | "remove");
            successResponse(bookmarks, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getBookmarks(req: Request, res: Response) {
        try {
            const userId = req.body.user; 
            const bookmarks = await this.service.getBookmarks(userId);
            successResponse(bookmarks, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getAgentDetailsById(req: Request, res: Response) {
        try {
            const {id} = req.params;

            const response = await this.service.getAgentDetailsById(id)
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default UserController