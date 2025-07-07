"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const PaymentController_1 = require("../controllers/PaymentController");
const verifyAuth_1 = require("../middlewares/verifyAuth");
const router = express_1.default.Router();
const paymentController = typedi_1.Container.get(PaymentController_1.PaymentController);
// Payment routes (requires authentication)
router.post("/initialize", verifyAuth_1.verifyAuth, (req, res) => paymentController.initializePayment(req, res));
router.get("/verify/:paymentReference", (req, res) => paymentController.verifyPayment(req, res));
router.get("/history", verifyAuth_1.verifyAuth, (req, res) => paymentController.getPaymentHistory(req, res));
router.post("/refund/:paymentId", verifyAuth_1.verifyAuth, (req, res) => paymentController.refundPayment(req, res));
exports.default = router;
