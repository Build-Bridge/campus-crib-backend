"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __importDefault(require("typedi"));
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const verifyAuth_1 = require("../middlewares/verifyAuth");
const router = (0, express_1.default)();
const userController = typedi_1.default.get(UserController_1.default);
router.post("/sign-up", (req, res) => userController.signUp(req, res));
router.post("/sign-in", (req, res) => userController.signIn(req, res));
router.post("/bookmark", verifyAuth_1.verifyAuth, (req, res) => userController.updateBookmark(req, res));
router.get("/bookmark", verifyAuth_1.verifyAuth, (req, res) => userController.getBookmarks(req, res));
router.get("/:id", (req, res) => userController.getAgentDetailsById(req, res));
router.patch("/update", verifyAuth_1.verifyAuth, (req, res) => userController.completeProfile(req, res));
exports.default = router;
