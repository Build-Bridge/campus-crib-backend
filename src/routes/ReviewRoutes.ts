import { Router } from "express";
import ReviewController from "../controllers/ReviewController";
import Container from "typedi";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();
const reviewController = Container.get(ReviewController);

router.post("/", verifyAuth, (req, res) => reviewController.createReview(req, res));
router.get("/hostel/:hostelId", (req, res) => reviewController.getReviewsByHostel(req, res));
router.get("/user/:userId", verifyAuth, (req, res) => reviewController.getReviewsByUser(req, res));
router.put("/:reviewId", verifyAuth, (req, res) => reviewController.updateReview(req, res));
router.delete("/:reviewId", verifyAuth, (req, res) => reviewController.deleteReview(req, res));

export default router;