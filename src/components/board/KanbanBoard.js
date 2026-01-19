import React, { useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { selectAllTasks } from '../../selectors/taskSelectors';
import { addColumn, updateColumn, deleteColumn } from '../../actions/columnActions';
import { addTask, updateTask, deleteTask } from '../../reducers/taskSlice';
import { useBoardDragDrop } from './hooks/useBoardDragDrop';
import Column from './Column';
import AddColumnForm from './AddColumnForm';
import DeleteColumnModal from './DeleteColumnModal';
import TaskModal from './TaskModal';

function KanbanBoard({ projectId, darkMode, sidebarOpen }) {
  const dispatch = useDispatch();
  const columns = useSelector(state => selectColumnsByProject(state, projectId));
  const allTasks = useSelector(selectAllTasks);
  
  // Memoize tasks grouped by column for performance optimization
  const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = allTasks.filter(task => task.columnId === column.id);
      return acc;
    }, {});
  }, [columns, allTasks]);
  
  // Task modal state
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Column editing state
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState('');
  
  // Add column state
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ 
    open: false, 
    column: null, 
    completed: 0, 
    incomplete: 0, 
    tasks: [],
    deleteOption: 'keep'
  });
  
  // Refs for synced scrolling
  const boardRef = useRef(null);
  const scrollbarRef = useRef(null);

  // Use custom drag-drop hook
  const { handleDragEnd } = useBoardDragDrop(columns, allTasks, projectId);

  // Scroll synchronization
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

  // Column handlers
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      dispatch(addColumn(projectId, newColumnName, columns.length));
      setNewColumnName('');
      setAddingColumn(false);
    }
  };

  const handleStartEditColumn = (columnId, name) => {
    setEditingColumnId(columnId);
    setEditedColumnName(name);
  };

  const handleSaveColumn = (columnId) => {
    const finalName = editedColumnName.trim() || 'Untitled Section';
    dispatch(updateColumn(columnId, { name: finalName }));
    setEditingColumnId(null);
    setEditedColumnName('');
  };

  const handleCancelEditColumn = () => {
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
    setDeleteModal({ 
      open: true, 
      column, 
      completed, 
      incomplete, 
      tasks,
      deleteOption: 'keep'
    });
  };

  const handleDeleteColumnKeepTasks = () => {
    if (!deleteModal.column) return;
    const backlog = columns[0];
    if (!backlog) return;
    
    deleteModal.tasks.forEach((task, idx) => {
      dispatch(updateTask({ id: task.id, changes: { columnId: backlog.id, order: idx } }));
    });
    dispatch(deleteColumn(deleteModal.column.id));
    closeDeleteModal();
  };

  const handleDeleteColumnAndTasks = () => {
    if (!deleteModal.column) return;
    
    deleteModal.tasks.forEach(task => {
      dispatch(deleteTask(task.id));
    });
    dispatch(deleteColumn(deleteModal.column.id));
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, column: null, completed: 0, incomplete: 0, tasks: [], deleteOption: 'keep' });
  };

  // Add section handler
  const handleAddSection = (columnIndex, direction) => {
    const column = columns[columnIndex];
    const insertOrder = direction === 'left' ? column.order : column.order + 1;
    const newColumnId = Date.now();
    dispatch(addColumn(projectId, 'Untitled Section', insertOrder, newColumnId));
    setEditingColumnId(newColumnId);
    setEditedColumnName('');
  };

  // Task handlers
  const handleAddTask = (columnId, title) => {
    const tasksInColumn = allTasks.filter(t => t.columnId === columnId);
    dispatch(addTask({
      id: Date.now(),
      projectId,
      columnId,
      title,
      description: '',
      dueDate: null,
      order: tasksInColumn.length,
      completed: false
    }));
  };

  const handleSetDueDate = (taskId, date) => {
    dispatch(updateTask({ id: taskId, changes: { dueDate: date } }));
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
                const tasks = allTasks
                  .filter(task => task.columnId === column.id)
                  .sort((a, b) => a.order - b.order);
                
                return (
                  <Column
                    key={column.id}
                    column={column}
                    columnIndex={columnIndex}
                    tasks={tasks}
                    editingColumnId={editingColumnId}
                    editedColumnName={editedColumnName}
                    onEditColumnChange={setEditedColumnName}
                    onSaveColumn={handleSaveColumn}
                    onStartEditColumn={handleStartEditColumn}
                    onCancelEditColumn={handleCancelEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onAddSection={handleAddSection}
                    onAddTask={handleAddTask}
                    onTaskClick={setSelectedTask}
                    onSetDueDate={handleSetDueDate}
                    darkMode={darkMode}
                  />
                );
              })}
              {provided.placeholder}

              <AddColumnForm
                isAdding={addingColumn}
                value={newColumnName}
                onChange={setNewColumnName}
                onAdd={handleAddColumn}
                onCancel={() => { setAddingColumn(false); setNewColumnName(''); }}
                onStartAdding={() => setAddingColumn(true)}
                darkMode={darkMode}
              />
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

        {/* Delete Column Modal */}
        <DeleteColumnModal
          isOpen={deleteModal.open}
          column={deleteModal.column}
          completed={deleteModal.completed}
          incomplete={deleteModal.incomplete}
          totalTasks={deleteModal.tasks.length}
          deleteOption={deleteModal.deleteOption}
          onOptionChange={(option) => setDeleteModal({ ...deleteModal, deleteOption: option })}
          onCancel={closeDeleteModal}
          onDeleteKeepTasks={handleDeleteColumnKeepTasks}
          onDeleteWithTasks={handleDeleteColumnAndTasks}
        />
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;