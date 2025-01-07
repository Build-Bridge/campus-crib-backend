"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_1 = __importDefault(require("../controllers/NotificationController"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const typedi_1 = __importDefault(require("typedi"));
const router = (0, express_1.Router)();
const notificationController = typedi_1.default.get(NotificationController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res) => notificationController.createNotification(req, res));
router.get("/:notificationId", verifyAuth_1.verifyAuth, (req, res) => notificationController.getNotificationById(req, res));
router.get("/user/:userId", verifyAuth_1.verifyAuth, (req, res) => notificationController.getNotificationsByUser(req, res));
router.put("/:notificationId", verifyAuth_1.verifyAuth, (req, res) => notificationController.updateNotification(req, res));
router.delete("/:notificationId", verifyAuth_1.verifyAuth, (req, res) => notificationController.deleteNotification(req, res));
exports.default = router;
