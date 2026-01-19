import React from 'react';

function AddTaskInput({ 
  isAdding, 
  value, 
  onChange, 
  onAdd, 
  onCancel, 
  onStartAdding, 
  darkMode 
}) {
  const handleBlur = () => {
    if (value.trim()) {
      onAdd();
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) onAdd();
    if (e.key === 'Escape') onCancel();
  };

  if (isAdding) {
    return (
      <div className="mt-3">
        <input
          className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-ceil ${darkMode ? 'bg-raisin border-ceil/30 text-lavender' : 'bg-white border-lavender text-raisin'}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Task title"
          autoFocus
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  return (
    <button
      className={`mt-3 p-2 rounded text-left transition-colors ${darkMode ? 'text-silver hover:bg-ceil/20' : 'text-silver hover:bg-lavender'}`}
      onClick={onStartAdding}
    >
      + Add Task
    </button>
  );
}

export default AddTaskInput;
