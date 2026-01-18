import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProjectWithColumns } from './actions/projectActions';
import Sidebar from './components/sidebar/Sidebar.js'
import KanbanBoard from './components/board/KanbanBoard.js'

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
    <div className= 'flex h-screen'>
      <Sidebar
        projects = {projects}
        selectedProjectId = {selectedProjectId}
        onSelectProject = {setSelectedProjectId}  
      />

      <div className="flex-1 bg-gray-100 p-5 overflow-auto">
        {selectedProjectId ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-5">Kanban Board</h1>
            <p>Board will go here...</p>
          </div>
        ) : (
          <p className= "text-gray-500">Select a project</p>
        )}
      </div>
    </div>
  );
}

export default App;
