import User from "../models/User.js"; // needed to resolve assignee
import Project from "../models/Project.js"; // optional, to validate projectId
import Ticket from "../models/Ticket.js";

// @desc    Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, projectId, assigneeEmail } = req.body;

    console.log("Creating ticket with:", {
      title,
      description,
      priority,
      projectId,
      assigneeEmail,
      createdBy: req.user?.email,
    });

    if (!title || !priority || !projectId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let assignee = null;
    if (assigneeEmail) {
      assignee = await User.findOne({ email: assigneeEmail });
      if (!assignee) {
        return res.status(404).json({ message: "Assignee not found" });
      }
    }

    const newTicket = new Ticket({
      title,
      description,
      priority,
      projectId,
      assignee: assignee?._id || null,
      createdBy: req.user._id,
    });

    await newTicket.save();
    await newTicket.populate("assignee", "name email");

    res.status(201).json(newTicket);
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// @desc    Get all tickets for a specific project
export const getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tickets = await Ticket.find({ projectId })
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// @desc    Update a ticket
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Ticket.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

// @desc    Delete a ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Ticket.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

// @desc    Assign a user to a ticket
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignee = userId;
    await ticket.save();

    res.json({ message: "Assignee updated", ticket });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign user" });
  }
};
