import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <TaskProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </TaskProvider>
    </AuthProvider>
);