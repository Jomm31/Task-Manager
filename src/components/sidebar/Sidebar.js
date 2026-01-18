

import React, { useState } from 'react';
import ProjectItem from './ProjectItem';
import { useDispatch } from 'react-redux';
import { addProject } from '../../actions/projectActions';

function Sidebar({ projects, selectedProjectId, onSelectProject }) {
  const dispatch = useDispatch();
  const [showInput, setShowInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      dispatch(addProject({ name: newProjectName }));
      setNewProjectName('');
      setShowInput(false);
    }
  };

  return (
    <div className="w-64 bg-slate-800 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-2">Projects <span className="text-xs text-slate-400">({projects.length})</span></h2>
      <div className="border-b border-slate-700 mb-4"></div>

      <div className="flex-1 overflow-y-auto">
        {projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            isSelected={selectedProjectId === project.id}
            onSelect={() => onSelectProject(project.id)}
            // onEdit, onDelete can be added later
          />
        ))}
      </div>

      <div className="mt-4">
        {showInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 rounded bg-slate-700 text-white focus:outline-none"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Project name"
              onKeyDown={e => { if (e.key === 'Enter') handleAddProject(); }}
            />
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
              onClick={handleAddProject}
            >Add</button>
            <button
              className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded"
              onClick={() => { setShowInput(false); setNewProjectName(''); }}
            >Cancel</button>
          </div>
        ) : (
          <button
            className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
            onClick={() => setShowInput(true)}
          >+ New Project</button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;