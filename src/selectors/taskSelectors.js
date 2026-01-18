import { createSelector } from 'reselect';
// Import selectAllTasks from the slice (uses entity adapter)
import { selectAllTasks } from '../reducers/taskSlice';

//basic selectors
//input selector
export const selectTasksState = (state) => state.tasks;

//get loading state
export const selectTasksLoading = (state) => state.tasks.loading;

//get error state
export const selectTasksError = (state) => state.tasks.error;

// Re-export selectAllTasks so it's available from this file too
export { selectAllTasks };

//memoized selectors

//get tasks for specific project - only recalculates when tasks change
export const selectTasksByProject = createSelector(
    [selectAllTasks, (state, projectId) => projectId],
    (tasks, projectId) => tasks.filter(task => task.projectId === projectId)
);

// Get tasks for a specific column (sorted by order) - for kanban board
export const selectTasksByColumn = createSelector(
    [selectAllTasks, (state, columnId) => columnId],
    (tasks, columnId) => 
        tasks
            .filter(task => task.columnId === columnId)
            .sort((a, b) => a.order - b.order)
);

//get completed tasks count
export const selectCompletedTasksCount = createSelector(
    [selectAllTasks],
    (tasks) => tasks.filter(task => task.completed).length
);