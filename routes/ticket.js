//import express from "express";
//import authMiddleware from "../middleware/authMiddleware.js";
//import {
//  createTicket,
//  getTicketsByProject,
//  updateTicket,
//  deleteTicket,
//  assignTicket,
//} from "../controllers/ticketController.js";
//
//const router = express.Router();
//
//router.use(authMiddleware);
//
//// CRUD routes
//router.post("/", createTicket);                    // Create ticket
//router.get("/:projectId", getTicketsByProject);    // List tickets by project
//router.put("/:id", updateTicket);                  // Update ticket
//router.delete("/:id", deleteTicket);               // Delete ticket
//router.put("/:id/assign", assignTicket);           // Assign ticket
//
//export default router;

import express from 'express';
import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  assignTicket
} from '../controllers/ticketController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/project/:projectId', authMiddleware, getTicketsByProject);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);
router.post('/:id/assign', authMiddleware, assignTicket);

export default router;

