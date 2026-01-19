import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

function TaskList({ columnId, tasks, onTaskClick, onSetDueDate, darkMode }) {
  return (
    <Droppable droppableId={String(columnId)} type="TASK">
      {(provided, snapshot) => (
        <div 
          className={`min-h-[40px] rounded transition-colors ${
            snapshot.isDraggingOver 
              ? darkMode ? 'bg-ceil/20' : 'bg-lavender' 
              : ''
          }`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {tasks.length === 0 && !snapshot.isDraggingOver ? (
            <p className="text-sm text-silver">No tasks</p>
          ) : (
            tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onSetDueDate={onSetDueDate}
                      darkMode={darkMode}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskList;
