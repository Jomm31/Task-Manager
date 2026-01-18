import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { selectAllTasks } from '../../selectors/taskSelectors';
import { addColumn, updateColumn, deleteColumn } from '../../actions/columnActions';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

function KanbanBoard({ projectId }) {
  const dispatch = useDispatch();
  const columns = useSelector(state => selectColumnsByProject(state, projectId));
  const allTasks = useSelector(selectAllTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState('');

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      dispatch(addColumn(projectId, newColumnName, columns.length));
      setNewColumnName('');
      setAddingColumn(false);
    }
  };

  const handleEditColumn = (columnId, name) => {
    setEditingColumnId(columnId);
    setEditedColumnName(name);
  };

  const handleSaveColumn = (columnId) => {
    if (editedColumnName.trim()) {
      dispatch(updateColumn(columnId, { name: editedColumnName }));
      setEditingColumnId(null);
      setEditedColumnName('');
    }
  };

  const handleDeleteColumn = (columnId) => {
    if (window.confirm('Delete this column?')) {
      dispatch(deleteColumn(columnId));
    }
  };

  return (
    <div className="flex gap-4 h-full mt-12">
      {columns.map(column => {
        const tasks = allTasks.filter(task => task.columnId === column.id);
        return (
          <div
            key={column.id}
            className="w-72 bg-gray-200 rounded-lg p-4 flex flex-col"
          >
            {/* Column Header with edit/delete */}
            <div className="flex items-center mb-3">
              {editingColumnId === column.id ? (
                <input
                  className="font-bold text-gray-700 bg-white rounded px-2 py-1 flex-1 mr-2"
                  value={editedColumnName}
                  onChange={e => setEditedColumnName(e.target.value)}
                  onBlur={() => handleSaveColumn(column.id)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveColumn(column.id); }}
                  autoFocus
                />
              ) : (
                <h3
                  className="font-bold text-gray-700 flex-1 cursor-pointer"
                  onDoubleClick={() => handleEditColumn(column.id, column.name)}
                  title="Double click to rename"
                >
                  {column.name}
                </h3>
              )}
              <button
                className="ml-2 text-red-400 hover:text-red-600 text-lg"
                onClick={() => handleDeleteColumn(column.id)}
                title="Delete column"
              >🗑️</button>
            </div>
            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-gray-400 text-sm">No tasks</p>
              ) : (
                tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))
              )}
            </div>
            {/* Add task button */}
            <button className="mt-2 p-2 text-gray-500 hover:bg-gray-300 rounded text-left">
              + Add Task
            </button>
          </div>
        );
      })}
      {/* Add Column Card */}
      <div className="w-72 bg-slate-100 rounded-lg p-4 flex flex-col items-center justify-center">
        {addingColumn ? (
          <div className="w-full flex flex-col gap-2">
            <input
              className="p-2 rounded border"
              value={newColumnName}
              onChange={e => setNewColumnName(e.target.value)}
              placeholder="Column name"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleAddColumn(); }}
            />
            <div className="flex gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleAddColumn}
              >Add</button>
              <button
                className="bg-slate-400 hover:bg-slate-500 text-white px-3 py-1 rounded"
                onClick={() => { setAddingColumn(false); setNewColumnName(''); }}
              >Cancel</button>
            </div>
          </div>
        ) : (
          <button
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors"
            onClick={() => setAddingColumn(true)}
          >+ Add Column</button>
        )}
      </div>
      {/* Task Modal for editing/viewing details */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default KanbanBoard;