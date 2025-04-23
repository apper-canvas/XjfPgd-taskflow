import { createContext, useState, useContext, useCallback } from 'react';
import * as projectService from '../services/projectService';
import { useAuth } from './AuthContext';

// Create the project context
const ProjectContext = createContext();

/**
 * Provider component for project data and operations
 * @param {Object} props - Component props
 * @returns {JSX.Element} The ProjectProvider component
 */
export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  /**
   * Fetch all projects with optional filtering
   * @param {Object} options - Fetch options
   */
  const fetchProjects = useCallback(async (options = {}) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedProjects = await projectService.fetchProjects(options);
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Fetch a single project by ID
   * @param {number} projectId - The ID of the project to fetch
   */
  const fetchProjectById = useCallback(async (projectId) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const project = await projectService.fetchProjectById(projectId);
      setCurrentProject(project);
      return project;
    } catch (err) {
      setError(err.message || `Failed to fetch project with ID ${projectId}`);
      console.error(`Error fetching project ${projectId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Create a new project
   * @param {Object} projectData - The project data to create
   * @returns {Promise<Object>} The created project
   */
  const createProject = useCallback(async (projectData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects(prevProjects => [...prevProjects, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      console.error('Error creating project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Update an existing project
   * @param {number} projectId - The ID of the project to update
   * @param {Object} projectData - The updated project data
   * @returns {Promise<Object>} The updated project
   */
  const updateProject = useCallback(async (projectId, projectData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedProject = await projectService.updateProject(projectId, projectData);
      
      // Update the projects array with the updated project
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.Id === projectId ? updatedProject : project
        )
      );
      
      // Update currentProject if it's the one being edited
      if (currentProject && currentProject.Id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      return updatedProject;
    } catch (err) {
      setError(err.message || `Failed to update project with ID ${projectId}`);
      console.error(`Error updating project ${projectId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, currentProject]);

  /**
   * Delete a project
   * @param {number} projectId - The ID of the project to delete
   * @returns {Promise<boolean>} True if successful, false otherwise
   */
  const deleteProject = useCallback(async (projectId) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await projectService.deleteProject(projectId);
      
      // Remove the deleted project from the projects array
      setProjects(prevProjects => 
        prevProjects.filter(project => project.Id !== projectId)
      );
      
      // Clear currentProject if it's the one being deleted
      if (currentProject && currentProject.Id === projectId) {
        setCurrentProject(null);
      }
      
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete project with ID ${projectId}`);
      console.error(`Error deleting project ${projectId}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, currentProject]);

  /**
   * Fetch tasks associated with a project
   * @param {number} projectId - The ID of the project
   */
  const fetchTasksByProject = useCallback(async (projectId) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const tasks = await projectService.fetchTasksByProject(projectId);
      setProjectTasks(tasks);
      return tasks;
    } catch (err) {
      setError(err.message || `Failed to fetch tasks for project with ID ${projectId}`);
      console.error(`Error fetching tasks for project ${projectId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create the context value object with state and methods
  const value = {
    projects,
    currentProject,
    projectTasks,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    fetchTasksByProject,
    setCurrentProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Custom hook to use the project context
 * @returns {Object} The project context value
 */
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export default ProjectContext;