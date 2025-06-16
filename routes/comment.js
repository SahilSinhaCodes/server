import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addComment,
  getCommentsByTicket,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", authMiddleware, addComment);
router.get("/ticket/:ticketId", authMiddleware, getCommentsByTicket);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
