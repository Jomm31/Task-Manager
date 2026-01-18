import React from 'react';

function TaskCard({ task, onClick }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  return (
    <div
      className="bg-white p-3 rounded-lg shadow mb-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <h4 className="font-medium text-gray-800 mb-2 truncate">{task.title}</h4>
      <p className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
    </div>
  );
}

export default TaskCard;
