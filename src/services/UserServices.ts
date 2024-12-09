import UserRepository from "../repositories/UserRepository";
import jwt from "jsonwebtoken"
require("dotenv").config();
import bcrypt from "bcrypt"
import "reflect-metadata";
import { Service } from "typedi";
import { IUser } from "../models/user";
import { Payload } from "../utils/response";


let jwtSecret = process.env.JWT_SECRET as string;

@Service()
export class UserServices {
    constructor(private readonly repo: UserRepository) { };

    generateToken(id: string) {
        let token = jwt.sign({ id }, jwtSecret)
        return token;
    }

    async signUp(data: Partial<IUser>): Promise<Payload> {
        try {
            let { email, password } = data;
            // let { size, houseHoldSize, primaryCookingAppliance } = data;

            let checkUser = await this.repo.findOne({email});
            if (checkUser) {
                return { message: "User with this email already exists." }
            }

            data.password =  await bcrypt.hash(password as string, 8);
            let user = await this.repo.create(data);

            let typeObject;
            // switch (type) {
            //     case UserType.BUSINESS:
            //         typeObject = await this.businessServices.createBusiness(typeData);
            //         break;
            //     case UserType.RIDER:
            //         typeObject = await this.riderServices.create(typeData)
            //         break;
            //     case UserType.CUSTOMER_SERVICE:
            //         typeObject = await this.csServices.create(typeData);
            //         break;
            //     case UserType.GAS_STATION:
            //         typeObject = await this.gsServices.create(typeData)
            //         break;
            //     case UserType.INDIVIDUAL:
            //         typeObject = await this.individualServices.create(typeData)
            //         break;
            //     case UserType.MERCHANT:
            //         typeObject = await this.merchantRepository.create(typeData)
            //         break;
            // }

            // let gasObject: GasDto = { size, houseHoldSize, primaryCookingAppliance, ownedBy: String(user._id) };

            // let gas = await this.gasRepo.create(gasObject)

            let token = this.generateToken(String(user._id))

            return {
                data: { user, token },
                message: "Signed up Successfully"
            }
        }
        catch (err: any) {
            throw Error(err.message);
        }
    }

    // async verifyOtp(otp: number, email: string) {
    //     try {
    //         let user: any = await this.repo.findOne({email});
    //         if (!user) {
    //             return {
    //                 payload: null,
    //                 message: "Email not found"
    //             }
    //         }

    //         let doMatch = await bcrypt.compare(String(otp), user.generatedOtp);
    //         if (!doMatch) {
    //             return { message: "Incorrect OTP", payload: null }
    //         }

    //         user.isVerified = true;
    //         user.generatedOtp = null
    //         user.generatedOtpExpiration = null
    //         user = await this.repo.update(user._id, user)
    //         let gas = await this.gasRepo.findByOwner(user._id);

    //         let token = this.generateToken(String(user._id))
    //         return {
    //             payload: { user, gas, token }
    //         }
    //     }
    //     catch (err: any) {
    //         throw Error(err.message);
    //     }
    // }

    async signIn(data: Partial<IUser>) {
        try {
            let { email, password } = data;
            let user = await this.repo.findOne({email})

            if (!user) {
                return { message: "User with this email does not exist" }
            }

            // if (user.isVerified !== true) {
            //     return { payload: null, message: "You're not verified yet!" }
            // }

            let doMatch = await bcrypt.compare(password as string, user.password);
            if (!doMatch) {
                return { message: "Incorrect Password" }
            }
            let token = this.generateToken(String(user._id))

            // switch (user.type) {
            //     case UserType.BUSINESS:
            //         typeObject = await this.businessRepo.findOne({ user: user._id })
            //         break;
            //     case UserType.CUSTOMER_SERVICE:
            //         typeObject = await this.csRepo.findOne({ user: user._id })
            //         break;
            //     case UserType.GAS_STATION:
            //         typeObject = await this.gasStationRepo.findOne({ user: user._id })
            //         break;
            //     case UserType.INDIVIDUAL:
            //         typeObject = await this.individualRepo.findOne({ user: user._id })
            //         break;
            //     case UserType.RIDER:
            //         typeObject = await this.riderRepo.findOne({ user: user._id })
            //         break;
            //     case UserType.MERCHANT:
            //             typeObject = await this.merchantRepository.findOne({ user: user._id })
            //             break;
            // }
            return {
                payload: { user, token }
            }
        }

        catch (err: any) {
            throw Error(err.message);
        }
    }

    async getUserById(id: string) {

    }

    async completeProfile(userId: string, data: any) {
        let user = await this.repo.findOne({_id: userId});
        
        if(!user){
            return {
                payload: null,
                message: "User not found",
                status: 400
            }
        }

        user = await this.repo.update({_id: userId}, data);

        return {
            payload: user,
            message: "Completed Successfully"
        }
    }

    // async forgotPassword(email: string){
    //     try{
    //         let user = await this.repo.find({email});
    //         if(!user){
    //             return {
    //                 payload: null,
    //                 message: "There is no user with this Email",
    //                 status: 400
    //             }
    //         }

    //         let otp = this.otpService.generateOTP();
    //         user.resetToken = String(otp);
    //         // this.emailService.sendResetToken(user.email, user.resetToken)
    //         user.resetTokenExpiration = new Date(new Date().setHours(new Date().getHours() + 5))
    //         this.repo.update(String(user._id), user)
    //         await this.otpService.sendCreateUserOTP(otp, user.email);
    //         return {
    //             message: "Check your Email"
    //         }
    //     }
    //     catch (err: any) {
    //         throw Error(err.message);
    //     }
    // }

    // async updatePassword(token: string, newPassword: string){
    //     try{
    //         let user = await this.repo.findByToken(token);

    //         if(!user){
    //             return {
    //                 payload: null,
    //                 message: "Invalid Token",
    //                 status: 400
    //             }
    //         }

    //        user.password = await bcrypt.hash(newPassword, 8)
    //        user.resetToken = null;
    //         user = await this.repo.update(String(user._id), user);

    //         return {
    //             payload: user,
    //             message: "Password Updated!"
    //         }
    //     }
    //     catch (err: any) {
    //         throw Error(err.message);
    //     }
    // }
}