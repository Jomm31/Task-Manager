import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProjectWithColumns } from './actions/projectActions';
import Sidebar from './components/sidebar/Sidebar.js';
import KanbanBoard from './components/board/KanbanBoard.js';
import ProjectModal from './components/sidebar/ProjectModal';

function App() {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

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

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      dispatch(addProjectWithColumns({ name: newProjectName }));
      setNewProjectName('');
      setShowProjectModal(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Header with burger icon */}
      <div className="absolute top-0 left-0 w-full h-14 bg-slate-900 flex items-center px-4 z-20">
        <button
          className="text-white text-2xl mr-4 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {/* Burger icon */}
          <span className="inline-block align-middle">
            &#9776;
          </span>
        </button>
        <span className="text-white text-lg font-bold">Task Manager</span>
      </div>
      {/* Sidebar - slides in/out */}
      <div
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-10 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}
      >
        <Sidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onShowProjectModal={() => setShowProjectModal(true)}
        />
      </div>
      {/* Main content area, with left margin if sidebar is open */}
      <div className={`flex-1 bg-gray-100 p-5 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
        {selectedProjectId ? (
          <KanbanBoard projectId={selectedProjectId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-xl">Select a project to view tasks</p>
          </div>
        )}
      </div>
      {/* Project Modal rendered at app level for true centering */}
      {showProjectModal && (
        <ProjectModal
          value={newProjectName}
          onChange={setNewProjectName}
          onAdd={handleAddProject}
          onCancel={() => { setShowProjectModal(false); setNewProjectName(''); }}
        />
      )}
    </div>
  );
}

export default App;
