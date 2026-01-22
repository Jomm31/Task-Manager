import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ColumnHeader from './ColumnHeader';
import TaskList from './TaskList';
import AddTaskInput from './AddTaskInput';

function Column({ 
  column, 
  columnIndex, 
  tasks, 
  editingColumnId,
  editedColumnName,
  onEditColumnChange,
  onSaveColumn,
  onStartEditColumn,
  onCancelEditColumn,
  onDeleteColumn,
  onAddSection,
  onAddTask,
  onTaskClick,
  onSetDueDate,
  darkMode 
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  return (
    <Draggable draggableId={`column-${column.id}`} index={columnIndex}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] min-h-[150px] max-h-full rounded-xl flex flex-col transition-colors duration-200 ${
            darkMode ? 'bg-dusk/90 border border-ceil/20 shadow-md' : 'bg-white/80 border border-white/50 shadow-sm backdrop-blur-sm'
          } ${
            snapshot.isDragging ? 'shadow-2xl ring-2 ring-ceil z-20' : ''
          }`}
        >
          <div className="p-3 sm:p-4 pb-0">
            <ColumnHeader
              column={column}
              taskCount={tasks.length}
              isEditing={editingColumnId === column.id}
              editedName={editedColumnName}
              onEditChange={onEditColumnChange}
              onSave={() => onSaveColumn(column.id)}
              onStartEdit={() => onStartEditColumn(column.id, column.name)}
              onCancelEdit={onCancelEditColumn}
              onDelete={() => onDeleteColumn(column.id)}
              onAddSection={(direction) => onAddSection(columnIndex, direction)}
              darkMode={darkMode}
              dragHandleProps={provided.dragHandleProps}
            />
          </div>

          <div className={`flex-1 overflow-y-auto px-3 sm:px-4 py-2 custom-scrollbar ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}
               style={{ minHeight: '50px' }}>
            <TaskList
              columnId={column.id}
              tasks={tasks}
              onTaskClick={onTaskClick}
              onSetDueDate={onSetDueDate}
              darkMode={darkMode}
            />
          </div>

          <div className="p-3 sm:p-4 pt-0">
            <AddTaskInput
              isAdding={isAddingTask}
              value={newTaskTitle}
              onChange={setNewTaskTitle}
              onAdd={handleAddTask}
              onCancel={handleCancelAddTask}
              onStartAdding={() => setIsAddingTask(true)}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
