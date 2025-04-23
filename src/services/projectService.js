import { getApperClient, TableNames, FieldNames } from "../utils/apperClient";

/**
 * Fetches projects with optional filtering, pagination, and sorting
 * @param {Object} options - Options for fetching projects
 * @param {Object} options.filters - Filters to apply to the query
 * @param {number} options.limit - Maximum number of projects to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {Array} options.orderBy - Sorting options
 * @returns {Promise<Object>} The project data response
 */
export const fetchProjects = async (options = {}) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const {
    filters = {},
    limit = 50,
    offset = 0,
    orderBy = [{ field: FieldNames.PROJECT.START_DATE, direction: "desc" }]
  } = options;
  
  // Construct project fields array from FieldNames.PROJECT
  const projectFields = Object.values(FieldNames.PROJECT);
  
  const params = {
    fields: projectFields,
    pagingInfo: { limit, offset },
    orderBy,
    filters
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.PROJECT, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Fetches a single project by ID
 * @param {number} projectId - The ID of the project to fetch
 * @returns {Promise<Object>} The project data
 */
export const fetchProjectById = async (projectId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  // Construct project fields array from FieldNames.PROJECT
  const projectFields = Object.values(FieldNames.PROJECT);
  
  const params = {
    fields: projectFields,
    filters: {
      [FieldNames.PROJECT.ID]: projectId
    }
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.PROJECT, params);
    return response.data?.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Creates a new project
 * @param {Object} projectData - The project data to create
 * @returns {Promise<Object>} The created project data
 */
export const createProject = async (projectData) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: projectData
  };
  
  try {
    const response = await apperClient.createRecord(TableNames.PROJECT, params);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Updates an existing project
 * @param {number} projectId - The ID of the project to update
 * @param {Object} projectData - The updated project data
 * @returns {Promise<Object>} The updated project data
 */
export const updateProject = async (projectId, projectData) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: projectData
  };
  
  try {
    const response = await apperClient.updateRecord(TableNames.PROJECT, projectId, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Deletes a project
 * @param {number} projectId - The ID of the project to delete
 * @returns {Promise<Object>} The deletion response
 */
export const deleteProject = async (projectId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  try {
    const response = await apperClient.deleteRecord(TableNames.PROJECT, projectId);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Fetches tasks associated with a project
 * @param {number} projectId - The ID of the project
 * @returns {Promise<Array>} The associated tasks
 */
export const fetchTasksByProject = async (projectId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  // First fetch task-project associations
  const associationParams = {
    fields: [FieldNames.TASK_PROJECT.ID, FieldNames.TASK_PROJECT.TASK_ID],
    filters: {
      [FieldNames.TASK_PROJECT.PROJECT_ID]: projectId
    }
  };
  
  try {
    // Get task-project associations
    const associationsResponse = await apperClient.fetchRecords(TableNames.TASK_PROJECT, associationParams);
    const associations = associationsResponse.data || [];
    
    if (associations.length === 0) {
      return [];
    }
    
    // Extract task IDs
    const taskIds = associations.map(assoc => assoc[FieldNames.TASK_PROJECT.TASK_ID]);
    
    // Fetch the actual tasks using the task IDs
    const taskFields = Object.values(FieldNames.TASK);
    
    const taskParams = {
      fields: taskFields,
      filters: {
        [FieldNames.TASK.ID]: { $in: taskIds }
      }
    };
    
    const tasksResponse = await apperClient.fetchRecords(TableNames.TASK, taskParams);
    return tasksResponse.data || [];
    
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    throw error;
  }
};

export default {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  fetchTasksByProject
};