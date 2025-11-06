// backend/server.js
import express from 'express';
import cors from 'cors';
import { connectDB, User, Task } from './db.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// --- AUTHENTICATION ENDPOINTS ---

// JWT Secret Key (VERY IMPORTANT: Use a strong, random key from environment variables in production)
const JWT_SECRET =
  process.env.JWT_SECRET || 'supersecretjwtkey_please_change_me_in_production';

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'employee',
    });
    await newUser.save();

    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    res
      .status(201)
      .json({ message: 'User registered successfully!', user: userResponse });
  } catch (error) {
    console.error('Error registering user:', error);
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const userResponse = { id: user._id, email: user.email, role: user.role };

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res
      .status(500)
      .json({ message: 'Server error during login', error: error.message });
  }
});

// --- JWT Verification Middleware (for protecting routes) ---
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user payload (id, role) to req.user
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
  }
};

// --- NEW ENDPOINT: GET all users (employees for assignment) ---
// backend/server.js
// ... (imports and other code) ...

// --- FIXED ENDPOINT: GET all employees (admin only) ---
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    // Allow only admin users to fetch employee list
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin.' });
    }

    // Fetch all users with role 'employee'
    const employees = await User.find({ role: 'employee' }).select(
      '_id email role'
    );

    if (!employees || employees.length === 0) {
      return res.status(200).json({ employees: [] });
    }

    // Log for debugging
    console.log('Fetched employees:', employees.length);

    // Return structured response
    res.status(200).json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// ... (rest of your backend code) ...

// --- TASK API ENDPOINTS ---

// GET all tasks (protected)
app.get('/api/tasks', verifyToken, async (req, res) => {
  try {
    console.log(
      'Accessing tasks as user:',
      req.user.id, // ID from JWT
      'Role:',
      req.user.role // Role from JWT
    );
    // Populate 'assignedTo' to include user details (email and role)
    const tasks = await Task.find().populate('assignedTo', 'email role');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res
      .status(500)
      .json({ message: 'Error fetching tasks', error: error.message });
  }
});

// GET tasks by user ID (protected)
app.get('/api/tasks/user/:userId', verifyToken, async (req, res) => {
  // Ensure the requesting user matches the userId or is an admin
  if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ assignedTo: userId }).populate(
      'assignedTo',
      'email role'
    );
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res
      .status(500)
      .json({ message: 'Error fetching user tasks', error: error.message });
  }
});

// CREATE a new task (protected - typically by admin)
app.post('/api/tasks', verifyToken, async (req, res) => {
  try {
    // Only allow admins to create tasks
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access denied: Only admins can create tasks.' });
    }

    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueDate,
      category,
    } = req.body;

    // Basic validation
    if (!title || !assignedTo || !dueDate || !category) {
      return res.status(400).json({
        message: 'Title, assignedTo, dueDate, and category are required.',
      });
    }

    // You might want to validate if `assignedTo` is a valid existing user ID and if that user is an 'employee'
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.role !== 'employee') {
      return res
        .status(400)
        .json({ message: 'Assigned user not found or is not an employee.' });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      status: status || 'new', // Default to 'new' if not provided
      priority: priority || 'medium', // Default to 'medium' if not provided
      dueDate,
      category, // Assuming you added category to your TaskSchema in db.js
    });

    await newTask.save();
    // Populate assignedTo info before sending response
    await newTask.populate('assignedTo', 'email role');

    res
      .status(201)
      .json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: 'Error creating task', error: error.message });
  }
});

// UPDATE task status (protected)
app.patch('/api/tasks/:taskId/status', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // Expecting { status: "newStatusValue" }

    if (!status) {
      return res.status(400).json({ message: 'New status is required.' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Authorization logic for updating task status
    if (req.user.role === 'admin') {
      // Admins can change any task's status
      task.status = status;
    } else if (
      req.user.role === 'employee' &&
      task.assignedTo.toString() === req.user.id
    ) {
      // Employees can only change the status of tasks assigned to them
      // And perhaps only to certain statuses (e.g., 'accepted', 'in progress', 'completed', 'failed')
      // You might want more granular control here, e.g., if (status === 'new' || status === 'rejected') deny employee change.
      task.status = status;
    } else {
      return res.status(403).json({
        message: 'Access denied: You are not authorized to update this task.',
      });
    }

    await task.save();
    await task.populate('assignedTo', 'email role'); // Populate after saving for the response

    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    if (error.name === 'CastError') {
      // For invalid taskId format
      return res.status(400).json({ message: 'Invalid Task ID format.' });
    }
    if (error.name === 'ValidationError') {
      // For invalid status enum
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: 'Error updating task status', error: error.message });
  }
});

// DELETE a task (protected - typically by admin)
app.delete('/api/tasks/:taskId', verifyToken, async (req, res) => {
  try {
    // Only allow admins to delete tasks
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access denied: Only admins can delete tasks.' });
    }

    const { taskId } = req.params;
    const result = await Task.findByIdAndDelete(taskId);

    if (!result) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Task ID format.' });
    }
    res
      .status(500)
      .json({ message: 'Error deleting task', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend API URL: http://localhost:${PORT}/api`);
});
