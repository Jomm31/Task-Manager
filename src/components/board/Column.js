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
          className={`w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] ${darkMode ? 'bg-dusk/90 border border-ceil/20' : 'bg-white/80'} rounded-lg p-3 sm:p-4 flex flex-col ${
            snapshot.isDragging ? 'shadow-2xl ring-2 ring-ceil' : ''
          }`}
        >
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

          <TaskList
            columnId={column.id}
            tasks={tasks}
            onTaskClick={onTaskClick}
            onSetDueDate={onSetDueDate}
            darkMode={darkMode}
          />

          <AddTaskInput
            isAdding={isAddingTask}
            value={newTaskTitle}
            onChange={setNewTaskTitle}
            onAdd={handleAddTask}
            onCancel={handleCancelAddTask}
            onStartAdding={() => setIsAddingTask(true)}
            darkMode={darkMode}
          />
          
          {/* Spacer to fill remaining height */}
          <div className="flex-1"></div>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
