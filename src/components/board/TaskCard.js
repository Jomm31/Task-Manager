import React from 'react';

function TaskCard({ task, onClick, darkMode, isDragging }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`p-3 rounded-lg shadow mb-2 cursor-pointer transition-all ${
        isDragging
          ? 'shadow-xl ring-2 ring-blue-400 rotate-2'
          : 'hover:shadow-md'
      } ${
        darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-white'
      }`}
      onClick={onClick}
    >
      <h4 className={`font-medium mb-2 truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {task.title}
      </h4>
      <p className={`text-sm flex items-center gap-1 ${
        isOverdue 
          ? 'text-red-500' 
          : darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        📅 {formatDate(task.dueDate)}
      </p>
    </div>
  );
}

export default TaskCard;
