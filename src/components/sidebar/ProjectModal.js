import React from 'react';

function ProjectModal({ value, onChange, onAdd, onCancel, darkMode }) {
  return (
    <div className="fixed inset-0 bg-midnight/80 flex items-center justify-center z-50">
      <div className="bg-dusk text-lavender rounded-lg p-6 w-full max-w-sm shadow-xl relative mx-4 border border-ceil/30">
        <button
          className="absolute top-3 right-3 text-silver hover:text-lavender text-2xl leading-none"
          onClick={onCancel}
        >&times;</button>
        <h2 className="text-lg font-bold mb-4 text-mist">Add Project</h2>
        <input
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-ceil bg-raisin border-ceil/30 text-lavender placeholder-silver"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Project name"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
        />
        <div className="flex gap-3">
          <button
            className="flex-1 bg-sage hover:bg-sage-dark text-raisin px-4 py-2 rounded font-medium transition-colors"
            onClick={onAdd}
          >Add</button>
          <button
            className="flex-1 bg-silver/50 hover:bg-silver/70 text-lavender px-4 py-2 rounded font-medium transition-colors"
            onClick={onCancel}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
