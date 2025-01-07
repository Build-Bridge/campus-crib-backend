"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InspectionController_1 = __importDefault(require("../controllers/InspectionController"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const typedi_1 = __importDefault(require("typedi"));
const router = (0, express_1.Router)();
const inspectionController = typedi_1.default.get(InspectionController_1.default);
router.post("/request-inspection", verifyAuth_1.verifyAuth, (req, res) => inspectionController.requestInspection(req, res));
router.post("/make-payment", verifyAuth_1.verifyAuth, (req, res) => inspectionController.makePayment(req, res));
exports.default = router;
