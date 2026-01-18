import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { selectAllTasks } from '../../selectors/taskSelectors';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

function KanbanBoard({ projectId }) {
  const columns = useSelector(state => selectColumnsByProject(state, projectId));
  const allTasks = useSelector(selectAllTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="flex gap-4 h-full">
      {columns.map(column => {
        const tasks = allTasks.filter(task => task.columnId === column.id);
        return (
          <div
            key={column.id}
            className="w-72 bg-gray-200 rounded-lg p-4 flex flex-col"
          >
            {/* Column Header */}
            <h3 className="font-bold text-gray-700 mb-3">{column.name}</h3>

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