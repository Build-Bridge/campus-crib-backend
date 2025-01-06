import { Router } from "express";
import InspectionController from "../controllers/InspectionController";
import { verifyAuth } from "../middlewares/verifyAuth";
import Container from "typedi";


const router = Router();
const inspectionController = Container.get(InspectionController)

router.post("/request-inspection", verifyAuth, (req, res) => inspectionController.requestInspection(req, res));
router.post("/make-payment", verifyAuth, (req, res) => inspectionController.makePayment(req, res));

export default router;