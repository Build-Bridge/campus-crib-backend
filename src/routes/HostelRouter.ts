import { Router } from "express";
import { Container } from "typedi";
import HostelController from "../controllers/HostelController";
import { verifyAuth } from "../middlewares/verifyAuth";

const router = Router();
const hostelController = Container.get(HostelController);

router.post("/",verifyAuth, (req, res, next) => hostelController.createHostel(req, res));
router.get("/",verifyAuth, (req, res) => hostelController.getAllHostels(req, res));
router.get("/:id", verifyAuth,(req, res) => hostelController.getHostelById(req, res));
router.put("/:id", verifyAuth,(req, res) => hostelController.updateHostel(req, res));
router.delete("/:id", verifyAuth,(req, res) => hostelController.deleteHostel(req, res));

export default router;
