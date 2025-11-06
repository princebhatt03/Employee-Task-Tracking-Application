// src/utils/api.js
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Helper function for fetch requests
const fetchData = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers, // Allow overriding headers
  };

  // Add authorization header if a token exists
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // JWTs are typically sent as "Bearer <token>"
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers, // Use the merged headers
    });

    // Handle 401/403 responses globally if needed (e.g., auto-logout)
    if (response.status === 401 || response.status === 403) {
      // Potentially trigger a logout action here if your app has one
      // window.location.href = '/login'; // Or navigate using react-router-dom's navigate
      // You might also throw a specific error type to be caught higher up
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// --- User API functions (no change needed here, fetchData handles the token) ---
export const loginUser = async (email, password) => {
  return fetchData(`${API_BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (email, password, role) => {
  return fetchData(`${API_BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
};

// --- Task API functions (these will now automatically include the token) ---
export const getAllTasks = async () => {
  return fetchData(`${API_BASE_URL}/tasks`);
};

export const getTasksByUserId = async (userId) => {
  return fetchData(`${API_BASE_URL}/tasks/user/${userId}`);
};

export const createTask = async (taskData) => {
  return fetchData(`${API_BASE_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTaskStatus = async (taskId, newStatus) => {
  // Your current updateTaskStatus expects newStatus as a direct argument.
  // The backend might expect an object like { status: newStatus }.
  // I'm aligning it to send an object to be more robust for future updates.
  return fetchData(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }), // Ensure this matches your backend's expectation
  });
};

export const deleteTask = async (taskId) => {
  return fetchData(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
};

// NEW: Function to fetch all users (or filtered by role, if backend supports)
export const getAllUsers = async () => {
  // Adjust this endpoint based on your backend.
  // If your backend has a /users endpoint that returns all users, use that.
  // If it supports filtering, e.g., /users?role=employee, use that.
  // For now, assuming a general /users endpoint.
  return fetchData(`${API_BASE_URL}/users`);
};

// You'd add other API functions here (e.g., update task details, get single task, etc.)
