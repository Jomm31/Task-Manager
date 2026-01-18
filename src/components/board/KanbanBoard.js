import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { selectAllTasks } from '../../selectors/taskSelectors';
import { addColumn, updateColumn, deleteColumn, reorderColumns } from '../../actions/columnActions';
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
  // State for 3-dots menu and submenu
  const [menuOpenColumnId, setMenuOpenColumnId] = useState(null);
  const [addSectionHover, setAddSectionHover] = useState(null);
  // State for delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, column: null, completed: 0, incomplete: 0, tasks: [] });

  // Add section handler
  const handleAddSection = (columnIndex, direction) => {
    const newName = window.prompt('Section name:');
    if (!newName || !newName.trim()) return;
    const insertIndex = direction === 'left' ? columnIndex : columnIndex + 1;
    dispatch(addColumn(projectId, newName.trim(), insertIndex));
    setMenuOpenColumnId(null);
    setAddSectionHover(null);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Handle column reordering
    if (type === 'COLUMN') {
      const reordered = Array.from(columns);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);
      dispatch(reorderColumns(reordered.map(c => c.id), projectId));
      return;
    }

    // Handle task reordering
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
    const column = columns.find(c => c.id === columnId);
    const tasks = allTasks.filter(t => t.columnId === columnId);
    if (tasks.length === 0) {
      dispatch(deleteColumn(columnId));
      return;
    }
    const completed = tasks.filter(t => t.completed).length;
    const incomplete = tasks.length - completed;
    setDeleteModal({ open: true, column, completed, incomplete, tasks });
  };

  // Actually delete column and keep tasks (move to backlog)
  const handleDeleteColumnKeepTasks = () => {
    if (!deleteModal.column) return;
    // Find backlog column (assume first column is backlog)
    const backlog = columns[0];
    if (!backlog) return;
    // Move all tasks to backlog
    deleteModal.tasks.forEach((task, idx) => {
      dispatch(updateTask({ id: task.id, changes: { columnId: backlog.id, order: idx } }));
    });
    dispatch(deleteColumn(deleteModal.column.id));
    setDeleteModal({ open: false, column: null, completed: 0, incomplete: 0, tasks: [] });
  };

  // Actually delete column and delete tasks
  const handleDeleteColumnAndTasks = () => {
    if (!deleteModal.column) return;
    // Delete all tasks in this column
    deleteModal.tasks.forEach(task => {
      dispatch(deleteTask(task.id));
    });
    dispatch(deleteColumn(deleteModal.column.id));
    setDeleteModal({ open: false, column: null, completed: 0, incomplete: 0, tasks: [] });
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
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div 
            className="flex gap-4 h-full pt-2 pb-4 overflow-x-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((column, columnIndex) => {
              const tasks = allTasks.filter(task => task.columnId === column.id).sort((a, b) => a.order - b.order);
              return (
                <Draggable key={column.id} draggableId={`column-${column.id}`} index={columnIndex}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`w-72 min-w-[18rem] ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg p-4 flex flex-col max-h-[calc(100vh-10rem)] ${
                        snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-400' : ''
                      }`}
                    >
                      {/* Column Header - this is the drag handle */}
                      <div 
                        className="flex items-center mb-3 cursor-grab active:cursor-grabbing group relative"
                        {...provided.dragHandleProps}
                      >
                        {editingColumnId === column.id ? (
                          <input
                            className={`font-bold ${darkMode ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} rounded px-2 py-1 flex-1 mr-2 focus:outline-none`}
                            value={editedColumnName}
                            onChange={e => setEditedColumnName(e.target.value)}
                            onBlur={() => handleSaveColumn(column.id)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveColumn(column.id); if (e.key === 'Escape') setEditingColumnId(null); }}
                            autoFocus
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <h3
                            className={`font-bold flex-1 cursor-pointer ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                            onDoubleClick={() => handleEditColumn(column.id, column.name)}
                            title="Double click to rename, drag to reorder"
                          >
                            {column.name} <span className={`text-xs font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({tasks.length})</span>
                          </h3>
                        )}
                        {/* 3-dots menu button, only visible on hover */}
                        <div className="relative ml-2">
                          <button
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
                            onClick={e => {
                              e.stopPropagation();
                              setMenuOpenColumnId(column.id === menuOpenColumnId ? null : column.id);
                            }}
                            title="Column options"
                          >
                            <span style={{fontSize: '1.5em', lineHeight: 1, color: '#fff'}}>⋯</span>
                          </button>
                          {/* Dropdown menu */}
                          {menuOpenColumnId === column.id && (
                            <div className={`absolute right-0 z-10 mt-2 w-44 rounded shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                 onClick={e => e.stopPropagation()}>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                  setEditingColumnId(column.id);
                                  setEditedColumnName(column.name);
                                  setMenuOpenColumnId(null);
                                }}
                              >Rename column</button>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-gray-700"
                                onClick={() => { handleDeleteColumn(column.id); setMenuOpenColumnId(null); }}
                              >Delete column</button>
                              <div className="border-t my-1 border-gray-300 dark:border-gray-600"></div>
                              <div className="group/add-section relative">
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-gray-700"
                                  onMouseEnter={() => setAddSectionHover(column.id)}
                                  onMouseLeave={() => setAddSectionHover(null)}
                                >Add section</button>
                                {/* Add section submenu */}
                                {addSectionHover === column.id && (
                                  <div className={`absolute left-full top-0 ml-1 w-48 rounded shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                       onMouseEnter={() => setAddSectionHover(column.id)}
                                       onMouseLeave={() => setAddSectionHover(null)}>
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"
                                      onClick={() => handleAddSection(columnIndex, 'left')}
                                    >Add section to left</button>
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"
                                      onClick={() => handleAddSection(columnIndex, 'right')}
                                    >Add section to right</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tasks List */}
                      <Droppable droppableId={String(column.id)} type="TASK">
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
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}

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
          </div>
        )}
      </Droppable>

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

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md`}>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Are you sure you want to delete this section?</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              This section <span className="font-semibold">{deleteModal.column?.name}</span> includes
              {deleteModal.completed > 0 && (
                <> <span className="font-semibold">{deleteModal.completed}</span> completed task{deleteModal.completed > 1 ? 's' : ''}</>
              )}
              {deleteModal.completed > 0 && deleteModal.incomplete > 0 && ' and'}
              {deleteModal.incomplete > 0 && (
                <> <span className="font-semibold">{deleteModal.incomplete}</span> incomplete task{deleteModal.incomplete > 1 ? 's' : ''}</>
              )}.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteOption"
                  checked={deleteModal.deleteOption !== 'delete'}
                  onChange={() => setDeleteModal({ ...deleteModal, deleteOption: 'keep' })}
                />
                <span className="text-gray-800 dark:text-gray-100">
                  Delete this section and keep these {deleteModal.incomplete} task{deleteModal.incomplete > 1 ? 's' : ''}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteOption"
                  checked={deleteModal.deleteOption === 'delete'}
                  onChange={() => setDeleteModal({ ...deleteModal, deleteOption: 'delete' })}
                />
                <span className="text-gray-800 dark:text-gray-100">
                  Delete this section and delete these {deleteModal.tasks.length} task{deleteModal.tasks.length !== 1 ? 's' : ''}
                </span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 px-4 py-2 rounded"
                onClick={() => setDeleteModal({ open: false, column: null, completed: 0, incomplete: 0, tasks: [] })}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (deleteModal.deleteOption === 'delete') {
                    handleDeleteColumnAndTasks();
                  } else {
                    handleDeleteColumnKeepTasks();
                  }
                }}
              >
                Delete Section
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
}

export default KanbanBoard;