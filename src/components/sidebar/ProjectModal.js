import React from 'react';

function ProjectModal({ value, onChange, onAdd, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg relative">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Add Project</h2>
        <input
          className="w-full p-2 border rounded mb-4"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Project name"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
        />
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex-1"
            onClick={onAdd}
          >Add</button>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white px-3 py-2 rounded flex-1"
            onClick={onCancel}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
