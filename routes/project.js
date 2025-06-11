import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with auth middleware
router.use(authMiddleware);

// Routes
router.post("/", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// ✅ New routes
router.put("/:id/add-member", addMember);
router.put("/:id/remove-member", removeMember);

export default router;
