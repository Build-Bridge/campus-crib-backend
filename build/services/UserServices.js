"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const bcrypt_1 = __importDefault(require("bcrypt"));
require("reflect-metadata");
const typedi_1 = require("typedi");
const HostelRepository_1 = __importDefault(require("../repositories/HostelRepository"));
let jwtSecret = process.env.JWT_SECRET;
let UserServices = class UserServices {
    constructor(repo, hostelRepo) {
        this.repo = repo;
        this.hostelRepo = hostelRepo;
    }
    ;
    generateToken(id) {
        let token = jsonwebtoken_1.default.sign({ id }, jwtSecret);
        return token;
    }
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = data;
                console.log(data);
                // let { size, houseHoldSize, primaryCookingAppliance } = data;
                let checkUser = yield this.repo.findOne({ email });
                if (checkUser) {
                    return { message: "User with this email already exists." };
                }
                data.password = yield bcrypt_1.default.hash(password, 8);
                let user = yield this.repo.create(data);
                console.log(user);
                let token = this.generateToken(String(user._id));
                return {
                    payload: { user, token },
                    message: "Signed up Successfully"
                };
            }
            catch (err) {
                throw Error(err.message);
            }
        });
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
    signIn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = data;
                let user = yield this.repo.findOne({ email });
                if (!user) {
                    return { message: "User with this email does not exist" };
                }
                // if (user.isVerified !== true) {
                //     return { payload: null, message: "You're not verified yet!" }
                // }
                let doMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!doMatch) {
                    return { message: "Incorrect Password" };
                }
                let token = this.generateToken(String(user._id));
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
                };
            }
            catch (err) {
                throw Error(err.message);
            }
        });
    }
    getAgentDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.findOne({ _id: id });
            let hostels = yield this.hostelRepo.find({ user: id });
            return {
                payload: { user, hostels },
                message: "Successful"
            };
        });
    }
    completeProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.findOne({ _id: userId });
            if (!user) {
                return {
                    payload: null,
                    message: "User not found",
                    status: 400
                };
            }
            user = yield this.repo.update({ _id: userId }, data);
            return {
                payload: user,
                message: "Completed Successfully"
            };
        });
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
    updateBookmark(userId, hostelId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.updateBookmark(userId, hostelId, action);
            if (!user) {
                throw new Error("User not found or failed to update bookmarks.");
            }
            return { payload: user.bookmarkedHostels, message: action === "add" ? "Boomarked Successfully" : "Removed from Bookmark Successfully!" };
        });
    }
    getHostelDetails(hostelIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const hostels = yield this.hostelRepo.find({ _id: { $in: hostelIds } });
            return hostels;
        });
    }
    getBookmarks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.findOne({ _id: userId });
            if (!user) {
                throw new Error("User not found");
            }
            let hostels = yield this.getHostelDetails(user.bookmarkedHostels);
            return { payload: hostels, message: "Bookmarks Retrieved Successfully" };
        });
    }
};
UserServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UserRepository_1.default, HostelRepository_1.default])
], UserServices);
exports.UserServices = UserServices;
