import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X, Calendar, Tag, AlertCircle } from 'lucide-react';

function MainFeature({ onAddTask }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    category: '',
    categoryColor: '#6366f1'
  });
  const [errors, setErrors] = useState({});
  
  const categoryOptions = [
    { name: 'Work', color: '#6366f1' },
    { name: 'Personal', color: '#ec4899' },
    { name: 'Health', color: '#10b981' },
    { name: 'Education', color: '#f59e0b' },
    { name: 'Finance', color: '#06b6d4' }
  ];
  
  const priorityOptions = ['High', 'Medium', 'Low'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleCategorySelect = (category) => {
    setFormData({ 
      ...formData, 
      category: category.name,
      categoryColor: category.color
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newTask = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      completedAt: null
    };
    
    onAddTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      category: '',
      categoryColor: '#6366f1'
    });
    
    setIsFormOpen(false);
  };
  
  return (
    <div className="relative">
      <AnimatePresence>
        {isFormOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card overflow-visible"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Add New Task</h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="What needs to be done?"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.title}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="input"
                      placeholder="Add details about this task..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          className={`input pl-10 ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                      </div>
                      {errors.dueDate && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.dueDate}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {priorityOptions.map(priority => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority })}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              formData.priority === priority
                                ? priority === 'High' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  : priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                            }`}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <div className="flex flex-wrap gap-2">
                        {categoryOptions.map(category => (
                          <button
                            key={category.name}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-sm transition-all ${
                              formData.category === category.name
                                ? 'bg-opacity-20 font-medium'
                                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                            }`}
                            style={formData.category === category.name ? {
                              backgroundColor: `${category.color}20`,
                              color: category.color
                            } : {}}
                          >
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            ></span>
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Add Task
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFormOpen(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-700 hover:border-primary dark:hover:border-primary flex items-center justify-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-all duration-200"
          >
            <PlusCircle size={20} />
            <span className="font-medium">Add New Task</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;