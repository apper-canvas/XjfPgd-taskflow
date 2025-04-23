import { createContext, useState, useContext, useCallback } from 'react';
import * as taskService from '../services/taskService';
import { useAuth } from './AuthContext';

// Create the task context
const TaskContext = createContext();

/**
 * Provider component for task data and operations
 * @param {Object} props - Component props
 * @returns {JSX.Element} The TaskProvider component
 */
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  /**
   * Fetch all tasks with optional filtering
   * @param {Object} options - Fetch options
   */
  const fetchTasks = useCallback(async (options = {}) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedTasks = await taskService.fetchTasks(options);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Fetch a single task by ID
   * @param {number} taskId - The ID of the task to fetch
   */
  const fetchTaskById = useCallback(async (taskId) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const task = await taskService.fetchTaskById(taskId);
      setCurrentTask(task);
      return task;
    } catch (err) {
      setError(err.message || `Failed to fetch task with ID ${taskId}`);
      console.error(`Error fetching task ${taskId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Create a new task
   * @param {Object} taskData - The task data to create
   * @returns {Promise<Object>} The created task
   */
  const createTask = useCallback(async (taskData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Update an existing task
   * @param {number} taskId - The ID of the task to update
   * @param {Object} taskData - The updated task data
   * @returns {Promise<Object>} The updated task
   */
  const updateTask = useCallback(async (taskId, taskData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      
      // Update the tasks array with the updated task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? updatedTask : task
        )
      );
      
      // Update currentTask if it's the one being edited
      if (currentTask && currentTask.Id === taskId) {
        setCurrentTask(updatedTask);
      }
      
      return updatedTask;
    } catch (err) {
      setError(err.message || `Failed to update task with ID ${taskId}`);
      console.error(`Error updating task ${taskId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, currentTask]);

  /**
   * Delete a task
   * @param {number} taskId - The ID of the task to delete
   * @returns {Promise<boolean>} True if successful, false otherwise
   */
  const deleteTask = useCallback(async (taskId) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await taskService.deleteTask(taskId);
      
      // Remove the deleted task from the tasks array
      setTasks(prevTasks => 
        prevTasks.filter(task => task.Id !== taskId)
      );
      
      // Clear currentTask if it's the one being deleted
      if (currentTask && currentTask.Id === taskId) {
        setCurrentTask(null);
      }
      
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete task with ID ${taskId}`);
      console.error(`Error deleting task ${taskId}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, currentTask]);

  /**
   * Associate a task with a project
   * @param {number} taskId - The ID of the task
   * @param {number} projectId - The ID of the project
   * @returns {Promise<Object>} The association data
   */
  const associateWithProject = useCallback(async (taskId, projectId) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const association = await taskService.associateTaskWithProject(taskId, projectId);
      return association;
    } catch (err) {
      setError(err.message || `Failed to associate task ${taskId} with project ${projectId}`);
      console.error(`Error associating task ${taskId} with project ${projectId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create the context value object with state and methods
  const value = {
    tasks,
    currentTask,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    associateWithProject,
    setCurrentTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Custom hook to use the task context
 * @returns {Object} The task context value
 */
export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;