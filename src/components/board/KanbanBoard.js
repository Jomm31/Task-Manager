import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { selectAllTasks } from '../../selectors/taskSelectors';
import { addColumn, updateColumn, deleteColumn, reorderColumns } from '../../actions/columnActions';
import { addTask, updateTask, deleteTask } from '../../reducers/taskSlice';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';


function KanbanBoard({ projectId, darkMode, sidebarOpen }) {
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
  
  // Ref for menu to detect clicks outside
  const menuRef = useRef(null);
  // Refs for synced scrolling
  const boardRef = useRef(null);
  const scrollbarRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenColumnId && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenColumnId(null);
        setAddSectionHover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenColumnId]);

  // Sync scrollbar with board scroll
  const handleBoardScroll = () => {
    if (scrollbarRef.current && boardRef.current) {
      scrollbarRef.current.scrollLeft = boardRef.current.scrollLeft;
    }
  };

  const handleScrollbarScroll = () => {
    if (boardRef.current && scrollbarRef.current) {
      boardRef.current.scrollLeft = scrollbarRef.current.scrollLeft;
    }
  };

  // Add section handler
  const handleAddSection = (columnIndex, direction) => {
    const column = columns[columnIndex];
    const insertOrder = direction === 'left' ? column.order : column.order + 1;
    const newColumnId = Date.now();
    dispatch(addColumn(projectId, 'Untitled Section', insertOrder, newColumnId));
    setMenuOpenColumnId(null);
    setAddSectionHover(null);
    // Automatically open edit mode for the new section
    setEditingColumnId(newColumnId);
    setEditedColumnName('');
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
    const finalName = editedColumnName.trim() || 'Untitled Section';
    dispatch(updateColumn(columnId, { name: finalName }));
    setEditingColumnId(null);
    setEditedColumnName('');
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
    <div className="h-full flex flex-col">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div 
             className="flex gap-3 sm:gap-4 pt-2 pb-4 overflow-x-auto items-stretch sm:invisible-scrollbar"
              ref={(el) => {
                provided.innerRef(el);
                boardRef.current = el;
              }}
              onScroll={handleBoardScroll}
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
                      className={`w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] ${darkMode ? 'bg-dusk/90 border border-ceil/20' : 'bg-white/80'} rounded-lg p-3 sm:p-4 flex flex-col ${
                        snapshot.isDragging ? 'shadow-2xl ring-2 ring-ceil' : ''
                      }`}
                    >
                      {/* Column Header - this is the drag handle */}
                      <div 
                        className="flex items-center mb-3 cursor-grab active:cursor-grabbing group relative"
                        {...provided.dragHandleProps}
                      >
                        {editingColumnId === column.id ? (
                          <input
                            className={`font-bold ${darkMode ? 'text-lavender bg-raisin' : 'text-raisin bg-lavender'} rounded px-2 py-1 w-[200px] focus:outline-none focus:ring-2 focus:ring-ceil`}
                            value={editedColumnName}
                            onChange={e => setEditedColumnName(e.target.value)}
                            onBlur={() => handleSaveColumn(column.id)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveColumn(column.id); if (e.key === 'Escape') setEditingColumnId(null); }}
                            autoFocus
                            onClick={e => e.stopPropagation()}
                            placeholder="New Section"
                          />
                        ) : (
                          <h3
                            className={`font-bold flex-1 cursor-pointer ${darkMode ? 'text-lavender' : 'text-raisin'}`}
                            onDoubleClick={() => handleEditColumn(column.id, column.name)}
                            title="Double click to rename, drag to reorder"
                          >
                            {column.name} <span className="text-xs font-normal text-silver">({tasks.length})</span>
                          </h3>
                        )}
                        {/* 3-dots menu button, only visible on hover or when menu is open */}
                        <div className="relative ml-2">
                          <button
                            className={`${menuOpenColumnId === column.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity p-1 rounded-md ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
                            onClick={e => {
                              e.stopPropagation();
                              setMenuOpenColumnId(column.id === menuOpenColumnId ? null : column.id);
                            }}
                            title="Column options"
                          >
                            <span style={{fontSize: '1.5em', lineHeight: 1}} className={darkMode ? 'text-lavender' : 'text-raisin'}>⋯</span>
                          </button>
                          {/* Dropdown menu */}
                          {menuOpenColumnId === column.id && (
                            <div 
                              ref={menuRef}
                              className={`absolute right-0 z-10 mt-2 w-44 rounded shadow-lg ${darkMode ? 'bg-raisin text-lavender' : 'bg-white text-raisin'} border ${darkMode ? 'border-ceil/30' : 'border-lavender'}`}
                              onClick={e => e.stopPropagation()}>
                              <button
                                className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
                                onClick={() => {
                                  setEditingColumnId(column.id);
                                  setEditedColumnName(column.name);
                                  setMenuOpenColumnId(null);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
                                  <path d="m20.234 3.673-14.49 14.49a5.121 5.121 0 0 0-1.209 1.925l-2.406 6.871a2.264 2.264 0 0 0 .54 2.369 2.266 2.266 0 0 0 2.371.541l6.872-2.405a5.144 5.144 0 0 0 1.924-1.209l14.49-14.491a5.728 5.728 0 0 0 0-8.092 5.73 5.73 0 0 0-8.092 0v.001ZM4.38 27.982a.27.27 0 0 1-.296-.067.269.269 0 0 1-.067-.294l2.124-6.065 4.304 4.304-6.065 2.123v-.001ZM26.912 5.088a3.726 3.726 0 0 1 0 5.263l-14.49 14.49c-.028.028-.064.047-.093.074l-5.244-5.244c.027-.029.046-.065.074-.093l14.49-14.49A3.71 3.71 0 0 1 24.281 4c.953 0 1.905.362 2.631 1.088Z"/>
                                </svg>
                                Rename column
                              </button>
                              <button
                                className={`w-full text-left px-4 py-2 flex items-center gap-2 text-rose ${darkMode ? 'hover:bg-rose/20' : 'hover:bg-rose/10'}`}
                                onClick={() => { handleDeleteColumn(column.id); setMenuOpenColumnId(null); }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Delete column
                              </button>
                              <div className="border-t my-1 border-ceil/30"></div>
                              <div className="group/add-section relative">
                                <button
                                  className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
                                  onMouseEnter={() => setAddSectionHover(column.id)}
                                  onMouseLeave={() => setAddSectionHover(null)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                  Add section
                                </button>
                                {/* Add section submenu */}
                                {addSectionHover === column.id && (
                                  <div className={`absolute left-full top-0  w-52 rounded shadow-lg ${darkMode ? 'bg-raisin text-lavender' : 'bg-white text-raisin'} border ${darkMode ? 'border-ceil/30' : 'border-lavender'}`}
                                       onMouseEnter={() => setAddSectionHover(column.id)}
                                       onMouseLeave={() => setAddSectionHover(null)}>
                                    <button
                                      className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
                                      onClick={() => handleAddSection(columnIndex, 'left')}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                      </svg>
                                      Add section to left
                                    </button>
                                    <button
                                      className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
                                      onClick={() => handleAddSection(columnIndex, 'right')}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                      </svg>
                                      Add section to right
                                    </button>
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
                                        onClick={() => setSelectedTask(task)}
                                        onSetDueDate={(taskId, date) => dispatch(updateTask({ id: taskId, changes: { dueDate: date } }))}
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

                      {/* Add Task - at bottom of tasks */}
                      {addingTaskColumnId === column.id ? (
                        <div className="mt-3">
                          <input
                            className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-ceil ${darkMode ? 'bg-raisin border-ceil/30 text-lavender' : 'bg-white border-lavender text-raisin'}`}
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="Task title"
                            autoFocus
                            onBlur={() => {
                              if (newTaskTitle.trim()) {
                                handleAddTask(column.id);
                              } else {
                                setAddingTaskColumnId(null);
                                setNewTaskTitle('');
                              }
                            }}
                            onKeyDown={e => { 
                              if (e.key === 'Enter' && newTaskTitle.trim()) handleAddTask(column.id); 
                              if (e.key === 'Escape') { setAddingTaskColumnId(null); setNewTaskTitle(''); }
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          className={`mt-3 p-2 rounded text-left transition-colors ${darkMode ? 'text-silver hover:bg-ceil/20' : 'text-silver hover:bg-lavender'}`}
                          onClick={() => setAddingTaskColumnId(column.id)}
                        >+ Add Task</button>
                      )}
                      
                      {/* Spacer to fill remaining height */}
                      <div className="flex-1"></div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}

            {/* Add Column Button */}
            {addingColumn ? (
              <div className={`w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] ${darkMode ? 'bg-dusk/90 border border-ceil/20' : 'bg-white/80'} rounded-lg p-3 sm:p-4 h-fit`}>
                <input
                  className={`w-full p-2 rounded border mb-2 focus:outline-none focus:ring-2 focus:ring-ceil ${darkMode ? 'bg-raisin border-ceil/30 text-lavender' : 'bg-white border-lavender text-raisin'}`}
                  value={newColumnName}
                  onChange={e => setNewColumnName(e.target.value)}
                  placeholder="Column name"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') { setAddingColumn(false); setNewColumnName(''); }}}
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-ceil hover:bg-ceil/80 text-raisin px-3 py-1 rounded transition-colors"
                    onClick={handleAddColumn}
                  >Add</button>
                  <button
                    className="flex-1 bg-silver/50 hover:bg-silver/70 text-lavender px-3 py-1 rounded transition-colors"
                    onClick={() => { setAddingColumn(false); setNewColumnName(''); }}
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <button
                className={`h-fit min-w-[150px] sm:min-w-[200px] px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${darkMode ? 'hover:bg-ceil/20 text-lavender' : 'hover:bg-white/50 text-raisin'}`}
                onClick={() => setAddingColumn(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Section
              </button>
            )}
          </div>
        )}
      </Droppable>

      {/* Fixed horizontal scrollbar at bottom of screen - hidden on mobile */}
      <div 
        ref={scrollbarRef}
        onScroll={handleScrollbarScroll}
        className={`fixed bottom-0 right-0 overflow-x-auto z-40 transition-all duration-300 hidden sm:block ${darkMode ? 'scrollbar-dark bg-raisin' : 'scrollbar-light bg-lavender'}`}
        style={{ left: sidebarOpen ? '256px' : '0', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      >
        <div style={{ width: `${columns.length * 296 + 200}px`, height: '1px' }}></div>
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

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 p-4">
          <div className="bg-dusk text-lavender rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md border border-ceil/30">
            <h2 className="text-lg font-bold mb-2 text-mist">Are you sure you want to delete this section?</h2>
            <p className="mb-4 text-mauve">
              This section <span className="font-semibold text-lavender">{deleteModal.column?.name}</span> includes
              {deleteModal.completed > 0 && (
                <> <span className="font-semibold text-lavender">{deleteModal.completed}</span> completed task{deleteModal.completed > 1 ? 's' : ''}</>
              )}
              {deleteModal.completed > 0 && deleteModal.incomplete > 0 && ' and'}
              {deleteModal.incomplete > 0 && (
                <> <span className="font-semibold text-lavender">{deleteModal.incomplete}</span> incomplete task{deleteModal.incomplete > 1 ? 's' : ''}</>
              )}.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteOption"
                  checked={deleteModal.deleteOption !== 'delete'}
                  onChange={() => setDeleteModal({ ...deleteModal, deleteOption: 'keep' })}
                  className="accent-ceil"
                />
                <span className="text-lavender">
                  Delete this section and keep these {deleteModal.incomplete} task{deleteModal.incomplete > 1 ? 's' : ''}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteOption"
                  checked={deleteModal.deleteOption === 'delete'}
                  onChange={() => setDeleteModal({ ...deleteModal, deleteOption: 'delete' })}
                  className="accent-ceil"
                />
                <span className="text-lavender">
                  Delete this section and delete these {deleteModal.tasks.length} task{deleteModal.tasks.length !== 1 ? 's' : ''}
                </span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-ceil/30 hover:bg-ceil/50 text-lavender px-4 py-2 rounded"
                onClick={() => setDeleteModal({ open: false, column: null, completed: 0, incomplete: 0, tasks: [] })}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-rose hover:bg-rose-dark text-mist px-4 py-2 rounded"
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
    </div>
  );
}

export default KanbanBoard;