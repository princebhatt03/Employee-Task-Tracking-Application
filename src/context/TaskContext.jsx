// src/context/TaskContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  getAllTasks,
  getTasksByUserId,
  createTask,
  updateTaskStatus,
  deleteTask,
  getAllUsers, // Import getAllUsers API function
} from '../utils/api';
import { AuthContext } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: State for active employees (users)
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState(null);

  const { user: currentUser, isAuthenticated } = useContext(AuthContext);

  // --- Functions to interact with the backend API ---

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedData = [];
      if (isAuthenticated && currentUser) {
        if (currentUser.role === 'admin') {
          fetchedData = await getAllTasks();
        } else if (currentUser.role === 'employee' && currentUser.id) {
          fetchedData = await getTasksByUserId(currentUser.id);
        }
      }
      setAllTasks(fetchedData);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.message || 'Failed to load tasks.');
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // ✅ FIXED: Fetch employees correctly
  const fetchEmployees = useCallback(async () => {
    // Only fetch employees if current user is admin
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      setEmployees([]);
      return;
    }

    setLoadingEmployees(true);
    setEmployeesError(null);

    try {
      const data = await getAllUsers(); // Backend returns { employees: [...] }

      // ✅ FIXED: Properly extract array
      const employeeList = Array.isArray(data.employees) ? data.employees : [];

      // If you want to filter only active employees (optional)
      const activeEmployees = employeeList.filter(
        user => user.role === 'employee' // Remove 'isActive' if not in schema
      );

      setEmployees(activeEmployees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployeesError(err.message || 'Failed to load employees.');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, [isAuthenticated, currentUser]);

  // Trigger fetchTasks and fetchEmployees when component mounts or dependencies change
  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, [fetchTasks, fetchEmployees]);

  const addTask = async newTaskData => {
    try {
      const response = await createTask(newTaskData);
      fetchTasks(); // Re-fetch all tasks to ensure latest data
      return response.task;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await updateTaskStatus(taskId, updates.status);
      fetchTasks();
      return response.task;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const removeTask = async taskId => {
    try {
      await deleteTask(taskId);
      setAllTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // --- Filtering logic for task statuses ---
  const newTasks = allTasks.filter(
    task => task.status === 'new' || task.status === 'pending'
  );
  const acceptedTasks = allTasks.filter(
    task => task.status === 'accepted' || task.status === 'in progress'
  );
  const completedTasks = allTasks.filter(task => task.status === 'completed');
  const failedTasks = allTasks.filter(task => task.status === 'failed');
  const rejectedTasks = allTasks.filter(task => task.status === 'rejected');
  const inProgressTasks = allTasks.filter(
    task => task.status === 'in progress'
  );

  const value = {
    tasks: allTasks,
    isLoadingTasks: loading,
    taskError: error,

    newTasks,
    acceptedTasks,
    completedTasks,
    failedTasks,
    rejectedTasks,
    inProgressTasks,

    fetchTasks,
    addTask,
    updateTask,
    deleteTask: removeTask,

    // ✅ Expose employees data
    users: employees,
    isLoadingUsers: loadingEmployees,
    usersError: employeesError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
