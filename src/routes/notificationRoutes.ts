import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
import { verifyAuth } from "../middlewares/verifyAuth";
import Container from "typedi";


const router = Router();
const notificationController = Container.get(NotificationController)
router.post("/", verifyAuth, (req, res) => notificationController.createNotification(req, res));

router.get("/user", verifyAuth, (req, res) => notificationController.getNotificationsByUser(req, res));
router.put("/:notificationId", verifyAuth, (req, res) => notificationController.updateNotification(req, res));
router.delete("/:notificationId", verifyAuth, (req, res) => notificationController.deleteNotification(req, res));

export default router;