import { Router } from "express";
import { Container } from "typedi";
import HostelController from "../controllers/HostelController";
import { verifyAuth } from "../middlewares/verifyAuth";
import { checkSubscriptionLimit, checkSubscriptionFeature } from "../middlewares/subscriptionCheck";

const router = Router();
const hostelController = Container.get(HostelController);

// Create hostel with subscription limit check
router.post("/", verifyAuth, checkSubscriptionLimit, (req, res, next) => hostelController.createHostel(req, res));

// Get hostels (no subscription check needed)
router.get("/", verifyAuth, (req, res) => hostelController.getAllHostels(req, res));
router.get("/:id", verifyAuth, (req, res) => hostelController.getHostelById(req, res));

// Update and delete hostels (no subscription check needed)
router.put("/:id", verifyAuth, (req, res) => hostelController.updateHostel(req, res));
router.delete("/:id", verifyAuth, (req, res) => hostelController.deleteHostel(req, res));

// Public routes
router.get("/recommended", (req, res) => hostelController.getRecommendedHostels(req, res));
router.get("/nearby", (req, res) => hostelController.getNearbyHostels(req, res));
router.get("/affordable", (req, res) => hostelController.getAffordableHostels(req, res));

// Subscription-based features
router.post("/:id/promote", verifyAuth, checkSubscriptionFeature('priorityListing'), (req, res) => hostelController.promoteHostel(req, res));
router.post("/:id/feature", verifyAuth, checkSubscriptionFeature('featuredBadge'), (req, res) => hostelController.featureHostel(req, res));
router.get("/:id/analytics", verifyAuth, checkSubscriptionFeature('analytics'), (req, res) => hostelController.getHostelAnalytics(req, res));

export default router;
