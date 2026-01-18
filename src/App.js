import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProjectWithColumns } from './actions/projectActions';
import Sidebar from './components/sidebar/Sidebar.js';
import KanbanBoard from './components/board/KanbanBoard.js';

function App() {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(addProjectWithColumns({ name: 'My First Project' }));
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  return (
    <div className="flex h-screen">
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />
      <div className="flex-1 bg-gray-100 p-5 overflow-auto">
        {selectedProjectId ? (
          <KanbanBoard projectId={selectedProjectId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-xl">Select a project to view tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
