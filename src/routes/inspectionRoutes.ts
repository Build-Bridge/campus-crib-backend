import { Router } from "express";
import InspectionController from "../controllers/InspectionController";
import InspectionService from "../services/InspectionService";
import { verifyAuth } from "../middlewares/verifyAuth";


const router = Router();
const inspectionService = new InspectionService();
const inspectionController = new InspectionController(inspectionService);

router.post("/request-inspection", verifyAuth, (req, res) => inspectionController.requestInspection(req, res));
router.post("/make-payment", verifyAuth, (req, res) => inspectionController.makePayment(req, res));

export default router;