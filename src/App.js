import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProjectWithColumns } from './actions/projectActions';
import './App.css';

function App() {
  const dispatch = useDispatch();
  
  // Get all projects from Redux
  const projects = useSelector(state => state.projects);
  
  // Track which project is currently selected
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // When app loads, create a default project if none exist
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(addProjectWithColumns({ name: 'My First Project' }));
    }
  }, []);

  // When projects load, select the first one
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  return (
    <div className="app">
      {/* Sidebar - Left side */}
      <div className="sidebar">
        <h2>Projects</h2>
        <div className="project-list">
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-item ${selectedProjectId === project.id ? 'active' : ''}`}
              onClick={() => setSelectedProjectId(project.id)}
            >
              {project.name}
            </div>
          ))}
        </div>
        <button className="add-project-btn">+ New Project</button>
      </div>

      {/* Main Content - Right side */}
      <div className="main-content">
        {selectedProjectId ? (
          <div className="kanban-board">
            <h1>Kanban Board (Project {selectedProjectId})</h1>
            <p>Board will go here...</p>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a project to view tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
