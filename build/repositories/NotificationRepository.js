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
const notification_1 = __importDefault(require("../models/notification"));
const BaseRepository_1 = require("./BaseRepository");
let NotificationRepository = class NotificationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(notification_1.default);
    }
    createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = new notification_1.default(notificationData);
            return yield notification.save();
        });
    }
    findNotificationById(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.findById(notificationId).exec();
        });
    }
    findNotificationsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.find({ user: userId }).sort({ createdAt: -1 }).exec();
        });
    }
    updateNotification(notificationId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.findByIdAndUpdate(notificationId, updateData, { new: true }).exec();
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.findByIdAndDelete(notificationId).exec();
        });
    }
    createMany(notifications) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdNotifications = yield notification_1.default.insertMany(notifications);
            return createdNotifications;
        });
    }
};
NotificationRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], NotificationRepository);
exports.default = NotificationRepository;
