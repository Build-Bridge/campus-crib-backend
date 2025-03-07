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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const UserServices_1 = require("../services/UserServices");
const response_1 = require("../utils/response");
let UserController = class UserController {
    constructor(service) {
        this.service = service;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let response = yield this.service.signUp(data);
                console.log(response);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                console.log(err);
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let response = yield this.service.signIn(data);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    completeProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let user = req.body.user;
                let response = yield this.service.completeProfile(user._id, data);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    updateBookmark(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user; // Retrieved from `verifyAuth` middleware
                const { hostelId, action } = req.body;
                if (!["add", "remove"].includes(action)) {
                    throw new Error("Invalid action. Use 'add' or 'remove'.");
                }
                const bookmarks = yield this.service.updateBookmark(userId, hostelId, action);
                (0, response_1.successResponse)(bookmarks, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getBookmarks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user;
                const bookmarks = yield this.service.getBookmarks(userId);
                (0, response_1.successResponse)(bookmarks, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getAgentDetailsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this.service.getAgentDetailsById(id);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
};
UserController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UserServices_1.UserServices])
], UserController);
exports.default = UserController;
