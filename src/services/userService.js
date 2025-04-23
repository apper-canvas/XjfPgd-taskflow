import { getApperClient, TableNames, FieldNames } from "../utils/apperClient";

/**
 * Fetches users with optional filtering, pagination, and sorting
 * @param {Object} options - Options for fetching users
 * @param {Object} options.filters - Filters to apply to the query
 * @param {number} options.limit - Maximum number of users to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {Array} options.orderBy - Sorting options
 * @returns {Promise<Object>} The user data response
 */
export const fetchUsers = async (options = {}) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const {
    filters = {},
    limit = 50,
    offset = 0,
    orderBy = [{ field: FieldNames.USER.NAME, direction: "asc" }]
  } = options;
  
  // Construct user fields array from FieldNames.USER
  const userFields = Object.values(FieldNames.USER);
  
  const params = {
    fields: userFields,
    pagingInfo: { limit, offset },
    orderBy,
    filters
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.USER, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Fetches a single user by ID
 * @param {number} userId - The ID of the user to fetch
 * @returns {Promise<Object>} The user data
 */
export const fetchUserById = async (userId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  // Construct user fields array from FieldNames.USER
  const userFields = Object.values(FieldNames.USER);
  
  const params = {
    fields: userFields,
    filters: {
      [FieldNames.USER.ID]: userId
    }
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.USER, params);
    return response.data?.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Creates a new user entry in the User1 table
 * @param {Object} userData - The user data to create
 * @returns {Promise<Object>} The created user data
 */
export const createUser = async (userData) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: userData
  };
  
  try {
    const response = await apperClient.createRecord(TableNames.USER, params);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Updates an existing user
 * @param {number} userId - The ID of the user to update
 * @param {Object} userData - The updated user data
 * @returns {Promise<Object>} The updated user data
 */
export const updateUser = async (userId, userData) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const params = {
    record: userData
  };
  
  try {
    const response = await apperClient.updateRecord(TableNames.USER, userId, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches tasks assigned to a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} The assigned tasks
 */
export const fetchTasksByUser = async (userId) => {
  const apperClient = getApperClient();
  
  if (!apperClient) {
    throw new Error("ApperClient not initialized");
  }
  
  const taskFields = Object.values(FieldNames.TASK);
  
  const params = {
    fields: taskFields,
    filters: {
      [FieldNames.TASK.ASSIGNED_TO]: userId
    }
  };
  
  try {
    const response = await apperClient.fetchRecords(TableNames.TASK, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching tasks for user ${userId}:`, error);
    throw error;
  }
};

export default {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  fetchTasksByUser
};