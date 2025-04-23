/**
 * Singleton ApperClient instance for application-wide use
 * Initializes the ApperClient with the application's Canvas ID
 */

// Canvas ID for the application
const CANVAS_ID = "8ac1bf2d6b3b4f9d9d32321e648b406a";

// Export ApperClient and ApperUI from the global SDK
let apperClient = null;

/**
 * Initialize and return the ApperClient instance
 * @returns {Object} The ApperClient instance
 */
export const getApperClient = () => {
  if (!apperClient && window.ApperSDK) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient(CANVAS_ID);
  }
  return apperClient;
};

/**
 * Get the ApperUI object from the SDK
 * @returns {Object} The ApperUI object
 */
export const getApperUI = () => {
  if (window.ApperSDK) {
    return window.ApperSDK.ApperUI;
  }
  return null;
};

/**
 * Table names from the database schema
 */
export const TableNames = {
  TASK: "task1",
  PROJECT: "project1",
  USER: "User1",
  TASK_PROJECT: "task_project"
};

/**
 * Field names for each table, organized for easy access
 */
export const FieldNames = {
  TASK: {
    ID: "Id",
    NAME: "Name",
    TITLE: "title",
    DESCRIPTION: "description",
    DUE_DATE: "due_date",
    STATUS: "status",
    PRIORITY: "priority",
    ASSIGNED_TO: "assigned_to"
  },
  PROJECT: {
    ID: "Id",
    NAME: "Name",
    DESCRIPTION: "description",
    START_DATE: "start_date",
    END_DATE: "end_date",
    STATUS: "status"
  },
  USER: {
    ID: "Id",
    NAME: "Name",
    EMAIL: "email",
    ROLE: "role"
  },
  TASK_PROJECT: {
    ID: "Id",
    NAME: "Name",
    TASK_ID: "task_id",
    PROJECT_ID: "project_id"
  }
};

/**
 * Picklist values for dropdown fields
 */
export const PicklistValues = {
  TASK_STATUS: ["Todo", "In Progress", "Completed"],
  TASK_PRIORITY: ["Low", "Medium", "High"],
  PROJECT_STATUS: ["Not Started", "In Progress", "Completed"],
  USER_ROLE: ["Admin", "Manager", "Member"]
};

export default {
  getApperClient,
  getApperUI,
  TableNames,
  FieldNames,
  PicklistValues,
  CANVAS_ID
};