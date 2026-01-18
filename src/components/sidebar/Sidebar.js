import React from 'react';
import ProjectItem from './ProjectItem';

function Sidebar({ projects, selectedProjectId, onSelectProject, onShowProjectModal }) {
  // Sidebar content
  const sidebarContent = (
    <div className="h-full w-64 bg-slate-800 text-white p-5 flex flex-col">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-bold flex-1">Projects <span className="text-xs text-slate-400">({projects.length})</span></h2>
        <button
          className="ml-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-xl"
          title="Add Project"
          onClick={onShowProjectModal}
        >+
        </button>
      </div>
      <div className="border-b border-slate-700 mb-4"></div>
      <div className="flex-1 overflow-y-auto">
        {projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            isSelected={selectedProjectId === project.id}
            onSelect={() => onSelectProject(project.id)}
          />
        ))}
      </div>
    </div>
  );

  return sidebarContent;
}

export default Sidebar;