// backend/db.js or server/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Schema = mongoose.Schema;

// --- User Schema ---
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true, // Store emails in lowercase
      trim: true, // Remove whitespace
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."], // Basic email regex validation
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
    },
    role: {
      // Added role for differentiating admin/employee
      type: String,
      enum: {
        values: ["admin", "employee"],
        message: 'Role must be either "admin" or "employee".',
      },
      default: "employee",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// --- Task Schema ---
const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // 'createdAt' is handled by timestamps: true, but keeping it explicit for clarity
    // If you only want a custom creation date, remove timestamps: true and uncomment this.
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },

    // Referencing the User model for assignment
    assignedTo: {
      type: Schema.Types.ObjectId, // This is a MongoDB ObjectId
      ref: "User", // This tells Mongoose which model the ObjectId refers to
      required: [true, "Task must be assigned to a user."],
    },
    status: {
      type: String,
      enum: {
        values: [
          "new",
          "pending",
          "accepted",
          "in progress",
          "completed",
          "failed",
          "rejected",
        ],
        message: "Invalid task status.",
      },
      default: "new",
      lowercase: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: 'Priority must be "low", "medium", or "high".',
      },
      default: "medium",
      lowercase: true,
    },
    // You might want to track who created the task (if admin created it)
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps for tasks too
  }
);

// Export Mongoose models
// backend/db.js
// ... (rest of the code is same)
export const User = mongoose.model("User", UserSchema);
export const Task = mongoose.model("Task", TaskSchema);
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // In a real application, you might want to log this error more robustly
    // and attempt re-connection or send an alert.
    process.exit(1); // Exit process with failure
  }
};// Model name changed to "Task"

// Connection to MongoDB

// Export the models and connection function

