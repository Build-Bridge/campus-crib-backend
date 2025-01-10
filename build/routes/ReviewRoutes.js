"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = __importDefault(require("../controllers/ReviewController"));
const typedi_1 = __importDefault(require("typedi"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const router = (0, express_1.Router)();
const reviewController = typedi_1.default.get(ReviewController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res) => reviewController.createReview(req, res));
router.get("/hostel/:hostelId", (req, res) => reviewController.getReviewsByHostel(req, res));
router.get("/user/:userId", verifyAuth_1.verifyAuth, (req, res) => reviewController.getReviewsByUser(req, res));
router.put("/:reviewId", verifyAuth_1.verifyAuth, (req, res) => reviewController.updateReview(req, res));
router.delete("/:reviewId", verifyAuth_1.verifyAuth, (req, res) => reviewController.deleteReview(req, res));
exports.default = router;
