import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Filter, SortAsc, SortDesc } from 'lucide-react';
import MainFeature from '../components/MainFeature';

function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted, completedAt: !task.isCompleted ? new Date().toISOString() : null } 
        : task
    ));
  };
  
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });
  
  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Organize your day, boost your productivity
          </p>
        </motion.div>
        
        {totalCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Progress</h2>
              <span className="text-sm font-medium">
                {completedCount} of {totalCount} tasks completed
              </span>
            </div>
            <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </motion.div>
        )}
        
        <MainFeature onAddTask={addTask} />
        
        {tasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-surface-500" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <button 
                onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100"
              >
                {sortDirection === 'desc' ? (
                  <>
                    <SortDesc size={16} />
                    <span>Newest</span>
                  </>
                ) : (
                  <>
                    <SortAsc size={16} />
                    <span>Oldest</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {sortedTasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className={`card p-0 overflow-hidden ${task.isCompleted ? 'border-green-200 dark:border-green-900' : ''}`}
                  >
                    <div className="task-item">
                      <div 
                        className={`task-checkbox ${task.isCompleted ? 'task-checkbox-checked' : ''}`}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.isCompleted && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-medium ${task.isCompleted ? 'line-through text-surface-400 dark:text-surface-500' : ''}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </div>
                            
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-surface-400 hover:text-red-500 dark:hover:text-red-400"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`mt-1 text-sm text-surface-600 dark:text-surface-400 ${task.isCompleted ? 'line-through text-surface-400 dark:text-surface-500' : ''}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex items-center gap-3">
                          {task.category && (
                            <span 
                              className="category-pill" 
                              style={{ 
                                backgroundColor: `${task.categoryColor}20`, 
                                color: task.categoryColor 
                              }}
                            >
                              {task.category}
                            </span>
                          )}
                          
                          {task.dueDate && (
                            <span className="text-xs text-surface-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {sortedTasks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-surface-500"
                >
                  <p>No tasks found. Add some tasks to get started!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;