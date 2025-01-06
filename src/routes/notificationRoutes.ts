import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
import NotificationService from "../services/NotificationService";
import NotificationRepository from "../repositories/NotificationRepository";
import { verifyAuth } from "../middlewares/verifyAuth";


const router = Router();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.post("/", verifyAuth, (req, res) => notificationController.createNotification(req, res));
router.get("/:notificationId", verifyAuth, (req, res) => notificationController.getNotificationById(req, res));
router.get("/user/:userId", verifyAuth, (req, res) => notificationController.getNotificationsByUser(req, res));
router.put("/:notificationId", verifyAuth, (req, res) => notificationController.updateNotification(req, res));
router.delete("/:notificationId", verifyAuth, (req, res) => notificationController.deleteNotification(req, res));

export default router;