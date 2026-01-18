import React, { useState } from 'react';

function ProjectItem({ project, isSelected, onSelect, onUpdate, onDelete, darkMode, isDragging }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);

  const handleSave = () => {
    if (editName.trim() && editName !== project.name) {
      onUpdate(editName);
    }
    setEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${project.name}"?`)) {
      onDelete();
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditName(project.name);
    setEditing(true);
  };

  return (
    <div
      className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
        isDragging
          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
          : isSelected 
            ? 'bg-blue-500 text-white' 
            : darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
              : 'bg-slate-700 hover:bg-slate-600 text-white'
      }`}
      onClick={!editing ? onSelect : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            className={`flex-1 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              darkMode 
                ? 'bg-gray-600 text-white border border-gray-500' 
                : 'bg-slate-600 text-white border border-slate-500'
            }`}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="p-1 rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); handleSave(); }}
            title="Save"
          >✓</button>
        </div>
      ) : (
        <span className="truncate flex-1">{project.name}</span>
      )}
      {hovered && !editing && (
        <span className="flex gap-1 ml-2">
          <button
            title="Edit"
            className="cursor-pointer text-slate-300 hover:text-white p-1 rounded hover:bg-slate-500 transition-colors"
            onClick={handleEditClick}
          >🖊️</button>
          <button
            title="Delete"
            className="cursor-pointer text-red-400 hover:text-red-500 p-1 rounded hover:bg-slate-500 transition-colors"
            onClick={handleDelete}
          >🗑️</button>
        </span>
      )}
    </div>
  );
}

export default ProjectItem;
