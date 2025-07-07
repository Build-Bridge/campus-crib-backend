import express from "express";
import { Container } from "typedi";
import { PaymentController } from "../controllers/PaymentController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = express.Router();
const paymentController = Container.get(PaymentController);

// Payment routes (requires authentication)
router.post("/initialize", verifyAuth, (req, res) => paymentController.initializePayment(req, res));
router.get("/verify/:paymentReference", (req, res) => paymentController.verifyPayment(req, res));
router.get("/history", verifyAuth, (req, res) => paymentController.getPaymentHistory(req, res));
router.post("/refund/:paymentId", verifyAuth, (req, res) => paymentController.refundPayment(req, res));

export default router; 