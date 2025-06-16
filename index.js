// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // ✅ Include .js extension!
import authRoutes from "./routes/auth.js"; // ✅ Include .js extension!
import projectRoutes from "./routes/project.js";
import ticketRoutes from "./routes/ticket.js";
import commentRoutes from "./routes/comment.js";
// Load .env variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

// inside app setup
app.use("/api/projects", projectRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/comments", commentRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
