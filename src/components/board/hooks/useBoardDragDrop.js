import { useDispatch } from 'react-redux';
import { reorderColumns } from '../../../actions/columnActions';
import { updateTask } from '../../../reducers/taskSlice';

export function useBoardDragDrop(columns, allTasks, projectId) {
  const dispatch = useDispatch();

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

  return { handleDragEnd };
}
