import React, { useState, useEffect } from 'react';

function TaskModal({ task, onClose, onSave, onDelete, darkMode }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`rounded-lg p-6 w-full max-w-md shadow-xl relative ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <button
          className={`absolute top-3 right-3 text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          }`}
          onClick={onClose}
        >
          ×
        </button>
        
        <h2 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Edit Task
        </h2>
        
        <div className="mb-4">
          <label className={`block mb-1.5 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Title
          </label>
          <input 
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter task title..."
          />
        </div>
        
        <div className="mb-4">
          <label className={`block mb-1.5 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea 
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            rows={4}
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description..."
          />
        </div>
        
        <div className="mb-6">
          <label className={`block mb-1.5 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Due Date
          </label>
          <input
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
