import React from 'react';

function AddColumnForm({ 
  isAdding, 
  value, 
  onChange, 
  onAdd, 
  onCancel, 
  onStartAdding, 
  darkMode 
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onAdd();
    if (e.key === 'Escape') onCancel();
  };

  if (isAdding) {
    return (
      <div className={`w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] ${darkMode ? 'bg-dusk/90 border border-ceil/20' : 'bg-white/80'} rounded-lg p-3 sm:p-4 h-fit`}>
        <input
          className={`w-full p-2 rounded border mb-2 focus:outline-none focus:ring-2 focus:ring-ceil ${darkMode ? 'bg-raisin border-ceil/30 text-lavender' : 'bg-white border-lavender text-raisin'}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Column name"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2">
          <button
            className="flex-1 bg-ceil hover:bg-ceil/80 text-raisin px-3 py-1 rounded transition-colors"
            onClick={onAdd}
          >
            Add
          </button>
          <button
            className="flex-1 bg-silver/50 hover:bg-silver/70 text-lavender px-3 py-1 rounded transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className={`h-fit min-w-[150px] sm:min-w-[200px] px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${darkMode ? 'hover:bg-ceil/20 text-lavender' : 'hover:bg-white/50 text-raisin'}`}
      onClick={onStartAdding}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Section
    </button>
  );
}

export default AddColumnForm;
