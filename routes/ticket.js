import express from 'express';
import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  assignTicket
} from '../controllers/ticketController.js';
import { getTicketById } from '../controllers/ticketController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from "../middleware/uploadMiddleware.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/project/:projectId', authMiddleware, getTicketsByProject);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);
router.post('/:id/assign', authMiddleware, assignTicket);
router.get('/:id', authMiddleware, getTicketById);


// Image upload route
router.post("/:id/upload-image", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.image = `/uploads/${req.file.filename}`;
    await ticket.save();

    res.json({ message: "Image uploaded successfully", image: ticket.image });
  } catch (err) {
    console.error("Image Upload Error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});


export default router;

