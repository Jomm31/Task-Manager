import { createSelector } from 'reselect';

// ========== BASIC SELECTORS ==========
// Projects use legacy Redux - state is just an array, not an object

// Get all projects (it's already an array)
export const selectAllProjects = (state) => state.projects;

// ========== MEMOIZED SELECTORS ==========

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