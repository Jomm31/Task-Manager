import React from 'react';

function ProjectModal({ value, onChange, onAdd, onCancel, darkMode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg p-6 w-full max-w-sm shadow-lg relative mx-4`}>
        <button
          className={`absolute top-3 right-3 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'} text-2xl leading-none`}
          onClick={onCancel}
        >&times;</button>
        <h2 className="text-lg font-bold mb-4">Add Project</h2>
        <input
          className={`w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Project name"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
        />
        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors"
            onClick={onAdd}
          >Add</button>
          <button
            className={`flex-1 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-400 hover:bg-slate-500'} text-white px-4 py-2 rounded font-medium transition-colors`}
            onClick={onCancel}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
