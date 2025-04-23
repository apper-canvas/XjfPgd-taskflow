import { getApperClient, TableNames, FieldNames } from "../utils/apperClient";

/**
 * Fetches tasks with optional filtering, pagination, and sorting
 * @param {Object} options - Options for fetching tasks
 * @param {Object} options.filters - Filters to apply to the query
 * @param {number} options.limit - Maximum number of tasks to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {Array} options.orderBy - Sorting options
 * @returns {Promise<Object>} The task data response
 */
export const fetchTasks = async (options = {}) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const {
    filters = {},
    limit = 50,
    offset = 0,
    orderBy = [{ field: FieldNames.TASK.DUE_DATE, direction: "asc" }]
  } = options;
  
  // Construct task fields array from FieldNames.TASK
  const taskFields = Object.values(FieldNames.TASK);
  
  const params = {
    fields: taskFields,
    pagingInfo: { limit, offset },
    orderBy,
    filters
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.TASK, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Fetches a single task by ID
 * @param {number} taskId - The ID of the task to fetch
 * @returns {Promise<Object>} The task data
 */
export const fetchTaskById = async (taskId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  // Construct task fields array from FieldNames.TASK
  const taskFields = Object.values(FieldNames.TASK);
  
  const params = {
    fields: taskFields,
    filters: {
      [FieldNames.TASK.ID]: taskId
    }
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.TASK, params);
    return response.data?.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Creates a new task
 * @param {Object} taskData - The task data to create
 * @returns {Promise<Object>} The created task data
 */
export const createTask = async (taskData) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: taskData
  };
  
  try {
    const response = await apperClient.createRecord(TableNames.TASK, params);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Updates an existing task
 * @param {number} taskId - The ID of the task to update
 * @param {Object} taskData - The updated task data
 * @returns {Promise<Object>} The updated task data
 */
export const updateTask = async (taskId, taskData) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: taskData
  };
  
  try {
    const response = await apperClient.updateRecord(TableNames.TASK, taskId, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Deletes a task
 * @param {number} taskId - The ID of the task to delete
 * @returns {Promise<Object>} The deletion response
 */
export const deleteTask = async (taskId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  try {
    const response = await apperClient.deleteRecord(TableNames.TASK, taskId);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Associates a task with a project
 * @param {number} taskId - The ID of the task
 * @param {number} projectId - The ID of the project
 * @returns {Promise<Object>} The created association data
 */
export const associateTaskWithProject = async (taskId, projectId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: {
      [FieldNames.TASK_PROJECT.TASK_ID]: taskId,
      [FieldNames.TASK_PROJECT.PROJECT_ID]: projectId
    }
  };
  
  try {
    const response = await apperClient.createRecord(TableNames.TASK_PROJECT, params);
    return response.data;
  } catch (error) {
    console.error(`Error associating task ${taskId} with project ${projectId}:`, error);
    throw error;
  }
};

export default {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  associateTaskWithProject
};