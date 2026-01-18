import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { selectAllTasks } from '../../selectors/taskSelectors';
import { addColumn, updateColumn, deleteColumn } from '../../actions/columnActions';
import { addTask, updateTask, deleteTask } from '../../reducers/taskSlice';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

function KanbanBoard({ projectId, darkMode }) {
  const dispatch = useDispatch();
  const columns = useSelector(state => selectColumnsByProject(state, projectId));
  const allTasks = useSelector(selectAllTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState('');
  const [addingTaskColumnId, setAddingTaskColumnId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = parseInt(draggableId);
    const sourceColumnId = parseInt(source.droppableId);
    const destColumnId = parseInt(destination.droppableId);
    
    // Get tasks in destination column
    const destTasks = allTasks
      .filter(t => t.columnId === destColumnId && t.id !== taskId)
      .sort((a, b) => a.order - b.order);
    
    // Insert at new position and update orders
    destTasks.splice(destination.index, 0, { id: taskId });
    
    // Update the moved task
    dispatch(updateTask({ 
      id: taskId, 
      changes: { 
        columnId: destColumnId, 
        order: destination.index 
      } 
    }));
    
    // Update order of other tasks in destination column
    destTasks.forEach((task, index) => {
      if (task.id !== taskId) {
        dispatch(updateTask({ id: task.id, changes: { order: index } }));
      }
    });
    
    // If moving between columns, update source column orders
    if (sourceColumnId !== destColumnId) {
      const sourceTasks = allTasks
        .filter(t => t.columnId === sourceColumnId && t.id !== taskId)
        .sort((a, b) => a.order - b.order);
      
      sourceTasks.forEach((task, index) => {
        dispatch(updateTask({ id: task.id, changes: { order: index } }));
      });
    }
  };

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
    if (window.confirm('Delete this column and all its tasks?')) {
      dispatch(deleteColumn(columnId));
    }
  };

  const handleAddTask = (columnId) => {
    if (newTaskTitle.trim()) {
      const tasksInColumn = allTasks.filter(t => t.columnId === columnId);
      dispatch(addTask({
        id: Date.now(),
        projectId,
        columnId,
        title: newTaskTitle,
        description: '',
        dueDate: null,
        order: tasksInColumn.length,
        completed: false
      }));
      setNewTaskTitle('');
      setAddingTaskColumnId(null);
    }
  };

  const handleUpdateTask = (updatedTask) => {
    dispatch(updateTask({ id: updatedTask.id, changes: updatedTask }));
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
    setSelectedTask(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full pt-2 pb-4 overflow-x-auto">
        {columns.map(column => {
          const tasks = allTasks.filter(task => task.columnId === column.id).sort((a, b) => a.order - b.order);
          return (
            <div
              key={column.id}
              className={`w-72 min-w-[18rem] ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg p-4 flex flex-col max-h-[calc(100vh-10rem)]`}
            >
              {/* Column Header */}
              <div className="flex items-center mb-3">
                {editingColumnId === column.id ? (
                  <input
                    className={`font-bold ${darkMode ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} rounded px-2 py-1 flex-1 mr-2 focus:outline-none`}
                  value={editedColumnName}
                  onChange={e => setEditedColumnName(e.target.value)}
                  onBlur={() => handleSaveColumn(column.id)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveColumn(column.id); if (e.key === 'Escape') setEditingColumnId(null); }}
                  autoFocus
                />
              ) : (
                <h3
                  className={`font-bold flex-1 cursor-pointer ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                  onDoubleClick={() => handleEditColumn(column.id, column.name)}
                  title="Double click to rename"
                >
                  {column.name} <span className={`text-xs font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({tasks.length})</span>
                </h3>
              )}
              <button
                className="ml-2 text-red-400 hover:text-red-500 text-lg transition-colors"
                onClick={() => handleDeleteColumn(column.id)}
                title="Delete column"
              >🗑️</button>
            </div>

            {/* Tasks List */}
            <Droppable droppableId={String(column.id)}>
              {(provided, snapshot) => (
                <div 
                  className={`flex-1 overflow-y-auto min-h-[100px] rounded transition-colors ${
                    snapshot.isDraggingOver 
                      ? darkMode ? 'bg-gray-700' : 'bg-gray-300' 
                      : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks.length === 0 && !snapshot.isDraggingOver ? (
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No tasks</p>
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
                              onClick={() => setSelectedTask(task)}
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

            {/* Add Task */}
            {addingTaskColumnId === column.id ? (
              <div className="mt-2">
                <input
                  className={`w-full p-2 rounded border mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleAddTask(column.id); if (e.key === 'Escape') { setAddingTaskColumnId(null); setNewTaskTitle(''); }}}
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                    onClick={() => handleAddTask(column.id)}
                  >Add</button>
                  <button
                    className={`flex-1 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-400 hover:bg-slate-500'} text-white px-3 py-1 rounded transition-colors`}
                    onClick={() => { setAddingTaskColumnId(null); setNewTaskTitle(''); }}
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <button
                className={`mt-2 p-2 rounded text-left transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-300'}`}
                onClick={() => setAddingTaskColumnId(column.id)}
              >+ Add Task</button>
            )}
          </div>
        );
      })}

      {/* Add Column Card */}
      <div className={`w-72 min-w-[18rem] ${darkMode ? 'bg-gray-800' : 'bg-slate-100'} rounded-lg p-4 flex flex-col items-center justify-center`}>
        {addingColumn ? (
          <div className="w-full flex flex-col gap-2">
            <input
              className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              value={newColumnName}
              onChange={e => setNewColumnName(e.target.value)}
              placeholder="Column name"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') { setAddingColumn(false); setNewColumnName(''); }}}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                onClick={handleAddColumn}
              >Add</button>
              <button
                className={`flex-1 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-400 hover:bg-slate-500'} text-white px-3 py-1 rounded transition-colors`}
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

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
          darkMode={darkMode}
        />
      )}
    </div>
    </DragDropContext>
  );
}

export default KanbanBoard;