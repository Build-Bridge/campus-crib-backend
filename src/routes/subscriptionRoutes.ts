import express from "express";
import { Container } from "typedi";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = express.Router();
const subscriptionController = Container.get(SubscriptionController);

// Get available subscription plans (public)
router.get("/plans", (req, res) => subscriptionController.getAvailablePlans(req, res));

// Subscription management (requires authentication)
router.post("/subscribe", verifyAuth, async (req, res) => await subscriptionController.createSubscription(req, res));
router.post("/cancel", verifyAuth, async (req, res) => await subscriptionController.cancelSubscription(req, res));
router.get("/current", verifyAuth, async (req, res) => await subscriptionController.getUserSubscription(req, res));
router.get("/features", verifyAuth, async (req, res) => await subscriptionController.getSubscriptionFeatures(req, res));
router.post("/upgrade", verifyAuth, async (req, res) => await subscriptionController.upgradeSubscription(req, res));
router.get("/limit", verifyAuth, async (req, res) => await subscriptionController.checkSubscriptionLimit(req, res));

export default router; 