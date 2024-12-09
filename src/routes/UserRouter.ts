import Container from "typedi";
import Router, { Request, Response } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = Container.get(UserController)

router.post("/sign-up", (req: Request, res: Response) => userController.signUp(req, res));
router.post("/sign-in", (req: Request, res: Response) => userController.signIn(req, res));

export default router;