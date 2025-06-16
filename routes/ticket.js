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

