import Project from "../models/Project.js";
import User from "../models/User.js";

// @desc    Create new project
export const createProject = async (req, res) => {
  try {
    const {title, description} = req.body;
    const newProject = new Project({
      title,
      description,
      createdBy: req.user._id,
      teamMembers: [req.user._id],
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({message: "Failed to create project"});
  }
};

// @desc    Get all projects for logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      teamMembers: req.user._id,
    }).populate("teamMembers", "name email");

    // ✅ Send empty array if no projects found
    res.json(projects);
  } catch (err) {
    console.error("Get projects failed:", err);
    res.status(500).json({message: "Failed to fetch projects"});
  }
};


// @desc    Update a project
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate(
      {_id: req.params.id, createdBy: req.user._id},
      req.body,
      {new: true}
    );
    if (!updated) {
      return res.status(404).json({message: "Project not found or unauthorized"});
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({message: "Failed to update project"});
  }
};

// @desc    Delete a project
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({message: "Project not found or unauthorized"});
    }
    res.json({message: "Project deleted successfully"});
  } catch (err) {
    res.status(500).json({message: "Failed to delete project"});
  }
};


// @desc    Add a member to a project by email
export const addMember = async (req, res) => {
  try {
    const {email} = req.body;
    const {id} = req.params;

    const userToAdd = await User.findOne({email});
    if (!userToAdd) {
      return res.status(404).json({message: "User not found"});
    }

    const project = await Project.findOne({
      _id: id,
      createdBy: req.user._id, // only creator can add
    });

    if (!project) {
      return res.status(403).json({message: "Unauthorized or project not found"});
    }

    // Avoid duplicate adds
    if (project.teamMembers.includes(userToAdd._id)) {
      return res.status(400).json({ message: `${email} is already a team member` });

    }

    project.teamMembers.push(userToAdd._id);
    await project.save();

    res.json({message: "Member added successfully", project});
  } catch (err) {
    console.error("Add Member Error:", err);
    res.status(500).json({message: "Failed to add member"});
  }
};


// @desc    Remove a member from a project by user ID
export const removeMember = async (req, res) => {
  try {
    const {userId} = req.body;
    const {id} = req.params;

    const project = await Project.findOne({
      _id: id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(403).json({message: "Unauthorized or project not found"});
    }

    // Don't allow removing yourself (creator)
    if (userId === req.user._id.toString()) {
      return res.status(400).json({message: "Creator cannot be removed"});
    }

    project.teamMembers = project.teamMembers.filter(
      (memberId) => memberId.toString() !== userId
    );
    await project.save();

    res.json({message: "Member removed successfully", project});
  } catch (err) {
    console.error("Remove Member Error:", err);
    res.status(500).json({message: "Failed to remove member"});
  }
};

// @desc    Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("teamMembers", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

