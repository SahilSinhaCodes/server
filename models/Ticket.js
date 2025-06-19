import mongoose from "mongoose";

// models/Ticket.js

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ New image field
    image: {
      type: String, // will store image path like "/uploads/filename.png"
      default: "",
    },
  },
  { timestamps: true }
);


const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
