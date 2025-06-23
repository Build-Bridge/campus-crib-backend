import Container from "typedi";
import Router, { Request, Response } from "express";
import UserController from "../controllers/UserController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();
const userController = Container.get(UserController)

router.post("/sign-up", (req: Request, res: Response) => userController.signUp(req, res));
router.post("/sign-in", (req: Request, res: Response) => userController.signIn(req, res));
router.post("/forgot-password", (req: Request, res: Response) => userController.forgotPassword(req, res));
router.post("/reset-password", (req: Request, res: Response) => userController.resetPassword(req, res));
router.post("/bookmark", verifyAuth, (req, res) => userController.updateBookmark(req, res));
router.get("/bookmark", verifyAuth, (req, res) => userController.getBookmarks(req, res));
router.get("/:id", (req, res) => userController.getAgentDetailsById(req, res));
router.patch("/update", verifyAuth , (req, res) => userController.completeProfile(req, res));

export default router; 