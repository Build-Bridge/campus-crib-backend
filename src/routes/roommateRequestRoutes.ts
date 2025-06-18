import express from 'express';
import Container from 'typedi';

import { verifyAuth } from '../middlewares/verifyAuth';
import RoommateRequestController from '../controllers/RoommateRequestController';

const router = express.Router();
const roommateRequestController = Container.get(RoommateRequestController);

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

export default router; 