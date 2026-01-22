import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProjectWithColumns, updateProject, deleteProject, reorderProjects } from './actions/projectActions';
import { selectAllTasks } from './selectors/taskSelectors';
import Sidebar from './components/sidebar/Sidebar.js';
import KanbanBoard from './components/board/KanbanBoard.js';
import ProjectModal from './components/sidebar/ProjectModal';
import CalendarView from './components/calendar/CalendarView';
import SearchBar from './components/common/SearchBar';
import TaskModal from './components/board/TaskModal';
import { updateTask, deleteTask } from './reducers/taskSlice';

function App() {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects);
  const allTasks = useSelector(selectAllTasks);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  // Initialize sidebar based on screen width
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [currentView, setCurrentView] = useState('board'); // 'board' or 'calendar'
  const [selectedTaskFromSearch, setSelectedTaskFromSearch] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const handleUpdateProject = (id, name) => {
    dispatch(updateProject(id, { name }));
  };

  const handleDeleteProject = (id) => {
    dispatch(deleteProject(id));
    if (selectedProjectId === id) {
      const remaining = projects.filter(p => p.id !== id);
      setSelectedProjectId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleReorderProjects = (projectIds) => {
    dispatch(reorderProjects(projectIds));
  };

  // Close sidebar on mobile when selecting project
  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setCurrentView('board'); // Switch to board view when selecting a project
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle search result clicks
  const handleSearchSelectTask = (task) => {
    setSelectedProjectId(task.projectId);
    setCurrentView('board');
    setSelectedTaskFromSearch(task);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleCalendarTaskClick = (task) => {
    setSelectedProjectId(task.projectId);
    setCurrentView('board');
    setSelectedTaskFromSearch(task);
  };

  const handleUpdateTaskFromModal = (updatedTask) => {
    dispatch(updateTask({ id: updatedTask.id, changes: updatedTask }));
    setSelectedTaskFromSearch(null);
  };

  const handleDeleteTaskFromModal = (taskId) => {
    dispatch(deleteTask(taskId));
    setSelectedTaskFromSearch(null);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-raisin' : 'bg-lavender'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full h-14 ${darkMode ? 'bg-raisin' : 'bg-raisin'} flex items-center justify-between px-2 sm:px-4 z-30 border-b ${darkMode ? 'border-ceil/30' : 'border-ceil/30'}`}>
        <div className="flex items-center shrink-0">
          <button
            className="text-lavender text-xl sm:text-2xl mr-2 sm:mr-4 focus:outline-none hover:bg-ceil/20 p-1.5 sm:p-2 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <span className="inline-block align-middle">&#9776;</span>
          </button>
          <span className="text-lavender text-base sm:text-lg font-bold hidden sm:block">Task Manager</span>
          <span className="text-lavender text-base font-bold sm:hidden">TM</span>
        </div>
        
        {/* Center - Search Bar */}
        <div className="flex-1 flex justify-center px-2 sm:px-4 min-w-0">
          <SearchBar
            projects={projects}
            tasks={allTasks}
            onSelectProject={handleSelectProject}
            onSelectTask={handleSearchSelectTask}
            darkMode={darkMode}
          />
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* View Toggle */}
          <div className="flex rounded-lg overflow-hidden bg-ceil/20">
            <button
              onClick={() => setCurrentView('board')}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'board'
                  ? 'bg-ceil text-raisin'
                  : 'text-lavender hover:text-white hover:bg-ceil/30'
              }`}
              title="Board View"
            >
              📋 <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'bg-ceil text-raisin'
                  : 'text-lavender hover:text-white hover:bg-ceil/30'
              }`}
              title="Calendar View"
            >
              📅 <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${darkMode ? 'bg-pastel text-raisin hover:bg-pastel/80' : 'bg-ceil/30 text-lavender hover:bg-ceil/50'}`}
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Sidebar Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-20 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 md:w-64`}
        >
          <Sidebar
            projects={[...projects].sort((a, b) => a.order - b.order)}
            selectedProjectId={selectedProjectId}
            onSelectProject={handleSelectProject}
            onShowProjectModal={() => setShowProjectModal(true)}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onReorderProjects={handleReorderProjects}
            darkMode={darkMode}
          />
        </aside>

        {/* Main Content */}
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''} ${darkMode ? 'bg-midnight' : 'bg-mist'} p-4 md:p-6`}>
          {currentView === 'calendar' ? (
            <CalendarView
              tasks={allTasks}
              projects={projects}
              onTaskClick={handleCalendarTaskClick}
              darkMode={darkMode}
            />
          ) : selectedProjectId ? (
            <KanbanBoard projectId={selectedProjectId} darkMode={darkMode} sidebarOpen={sidebarOpen} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`text-xl ${darkMode ? 'text-silver' : 'text-silver'}`}>Select a project to view tasks</p>
            </div>
          )}
        </main>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <ProjectModal
          value={newProjectName}
          onChange={setNewProjectName}
          onAdd={handleAddProject}
          onCancel={() => { setShowProjectModal(false); setNewProjectName(''); }}
          darkMode={darkMode}
        />
      )}

      {/* Task Modal from Search/Calendar */}
      {selectedTaskFromSearch && (
        <TaskModal
          task={selectedTaskFromSearch}
          onClose={() => setSelectedTaskFromSearch(null)}
          onSave={handleUpdateTaskFromModal}
          onDelete={handleDeleteTaskFromModal}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;
