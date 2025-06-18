"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = __importDefault(require("typedi"));
const RoommateRequestController_1 = __importDefault(require("../controllers/RoommateRequestController"));
const router = express_1.default.Router();
const roommateRequestController = typedi_1.default.get(RoommateRequestController_1.default);
// All routes require authentication
// router.use(verifyAuth);
// Create a new roommate request
router.post('/', (req, res) => roommateRequestController.createRoommateRequest(req, res));
// Get all roommate requests
router.get('/', (req, res) => roommateRequestController.getAllRoommateRequests(req, res));
// Get a specific roommate request
router.get('/:id', (req, res) => roommateRequestController.getRoommateRequestById(req, res));
// Add a comment to a roommate request
router.post('/:id/comments', (req, res) => roommateRequestController.addComment(req, res));
// Update a roommate request
router.put('/:id', (req, res) => roommateRequestController.updateRoommateRequest(req, res));
// Delete a roommate request
router.delete('/:id', (req, res) => roommateRequestController.deleteRoommateRequest(req, res));
exports.default = router;
