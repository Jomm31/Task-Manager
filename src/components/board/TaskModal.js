import React, { useState } from 'react';

function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Title</label>
          <input className="w-full p-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea className="w-full p-2 border rounded" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Due Date</label>
          <input
            className="w-full p-2 border rounded"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        {/* Add edit/save/delete logic here later */}
      </div>
    </div>
  );
}

export default TaskModal;
