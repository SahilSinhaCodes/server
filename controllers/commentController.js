import Comment from "../models/Comment.js";
import Ticket from "../models/Ticket.js";

// Create a comment
export const addComment = async (req, res) => {
  const { ticketId, text } = req.body;

  if (!text || !ticketId) {
    return res.status(400).json({ message: "Text and ticketId are required" });
  }

  try {
    const comment = await Comment.create({
      ticketId,
      userId: req.user._id,
      text,
    });

    const populated = await comment.populate("userId", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments by ticket
export const getCommentsByTicket = async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.ticketId })
      .populate("userId", "name email")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error("Fetch Comments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
