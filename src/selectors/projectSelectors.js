import { createSelector } from 'reselect';

// ========== BASIC SELECTORS ==========
// Projects use legacy Redux - state is just an array, not an object

// Get all projects (it's already an array)
export const selectAllProjects = (state) => state.projects;

// ========== MEMOIZED SELECTORS ==========

// Get all projects sorted by order (for sidebar display)
export const selectProjectsSorted = createSelector(
    [selectAllProjects],
    (projects) => [...projects].sort((a, b) => a.order - b.order)
);

// Get project by ID
export const selectProjectById = createSelector(
    [selectAllProjects, (state, projectId) => projectId],
    (projects, projectId) => projects.find(p => p.id === projectId)
);

// Get total project count
export const selectProjectCount = createSelector(
    [selectAllProjects],
    (projects) => projects.length
);

// Get active (non-completed) projects
export const selectActiveProjects = createSelector(
    [selectAllProjects],
    (projects) => projects.filter(p => !p.completed)
);