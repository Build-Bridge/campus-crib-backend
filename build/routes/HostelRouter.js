"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const HostelController_1 = __importDefault(require("../controllers/HostelController"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const subscriptionCheck_1 = require("../middlewares/subscriptionCheck");
const router = (0, express_1.Router)();
const hostelController = typedi_1.Container.get(HostelController_1.default);
// Create hostel with subscription limit check
router.post("/", verifyAuth_1.verifyAuth, subscriptionCheck_1.checkSubscriptionLimit, (req, res, next) => hostelController.createHostel(req, res));
// Get hostels (no subscription check needed)
router.get("/", verifyAuth_1.verifyAuth, (req, res) => hostelController.getAllHostels(req, res));
router.get("/:id", verifyAuth_1.verifyAuth, (req, res) => hostelController.getHostelById(req, res));
// Update and delete hostels (no subscription check needed)
router.put("/:id", verifyAuth_1.verifyAuth, (req, res) => hostelController.updateHostel(req, res));
router.delete("/:id", verifyAuth_1.verifyAuth, (req, res) => hostelController.deleteHostel(req, res));
// Public routes
router.get("/recommended", (req, res) => hostelController.getRecommendedHostels(req, res));
router.get("/nearby", (req, res) => hostelController.getNearbyHostels(req, res));
router.get("/affordable", (req, res) => hostelController.getAffordableHostels(req, res));
// Subscription-based features
router.post("/:id/promote", verifyAuth_1.verifyAuth, (0, subscriptionCheck_1.checkSubscriptionFeature)('priorityListing'), (req, res) => hostelController.promoteHostel(req, res));
router.post("/:id/feature", verifyAuth_1.verifyAuth, (0, subscriptionCheck_1.checkSubscriptionFeature)('featuredBadge'), (req, res) => hostelController.featureHostel(req, res));
router.get("/:id/analytics", verifyAuth_1.verifyAuth, (0, subscriptionCheck_1.checkSubscriptionFeature)('analytics'), (req, res) => hostelController.getHostelAnalytics(req, res));
exports.default = router;
