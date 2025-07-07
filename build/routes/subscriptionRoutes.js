"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const SubscriptionController_1 = require("../controllers/SubscriptionController");
const verifyAuth_1 = require("../middlewares/verifyAuth");
const router = express_1.default.Router();
const subscriptionController = typedi_1.Container.get(SubscriptionController_1.SubscriptionController);
// Get available subscription plans (public)
router.get("/plans", (req, res) => subscriptionController.getAvailablePlans(req, res));
// Subscription management (requires authentication)
router.post("/subscribe", verifyAuth_1.verifyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield subscriptionController.createSubscription(req, res); }));
router.post("/cancel", verifyAuth_1.verifyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield subscriptionController.cancelSubscription(req, res); }));
router.get("/current", verifyAuth_1.verifyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield subscriptionController.getUserSubscription(req, res); }));
router.get("/features", verifyAuth_1.verifyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield subscriptionController.getSubscriptionFeatures(req, res); }));
router.post("/upgrade", verifyAuth_1.verifyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield subscriptionController.upgradeSubscription(req, res); }));
router.get("/limit", verifyAuth_1.verifyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield subscriptionController.checkSubscriptionLimit(req, res); }));
exports.default = router;
