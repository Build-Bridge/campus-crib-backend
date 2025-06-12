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
const typedi_1 = require("typedi");
const RoomateRequestService_1 = __importDefault(require("../services/RoomateRequestService"));
const response_1 = require("../utils/response");
let RoommateRequestController = class RoommateRequestController {
    constructor(service) {
        this.service = service;
    }
    createRoommateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = Object.assign(Object.assign({}, req.body), { userId: req.body.user // Retrieved from verifyAuth middleware
                 });
                const response = yield this.service.createRoommateRequest(data);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getAllRoommateRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.service.getAllRoommateRequests(req.query);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    getRoommateRequestById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this.service.getRoommateRequestById(id);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.user; // Retrieved from verifyAuth middleware
                const { content } = req.body;
                if (!content) {
                    throw new Error("Comment content is required");
                }
                const response = yield this.service.addComment(id, userId, content);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    updateRoommateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.user; // Retrieved from verifyAuth middleware
                const data = req.body;
                const response = yield this.service.updateRoommateRequest(id, userId, data);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
    deleteRoommateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.user; // Retrieved from verifyAuth middleware
                const response = yield this.service.deleteRoommateRequest(id, userId);
                (0, response_1.successResponse)(response, res);
            }
            catch (err) {
                (0, response_1.errorResponse)(err.message, res);
            }
        });
    }
};
RoommateRequestController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [RoomateRequestService_1.default])
], RoommateRequestController);
exports.default = RoommateRequestController;
