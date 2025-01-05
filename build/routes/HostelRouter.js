"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const HostelController_1 = __importDefault(require("../controllers/HostelController"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const router = (0, express_1.Router)();
const hostelController = typedi_1.Container.get(HostelController_1.default);
router.post("/", verifyAuth_1.verifyAuth, (req, res, next) => hostelController.createHostel(req, res));
router.get("/", verifyAuth_1.verifyAuth, (req, res) => hostelController.getAllHostels(req, res));
router.get("/:id", verifyAuth_1.verifyAuth, (req, res) => hostelController.getHostelById(req, res));
router.put("/:id", verifyAuth_1.verifyAuth, (req, res) => hostelController.updateHostel(req, res));
router.delete("/:id", verifyAuth_1.verifyAuth, (req, res) => hostelController.deleteHostel(req, res));
exports.default = router;
