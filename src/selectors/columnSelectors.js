import { createSelector } from 'reselect';

// ========== BASIC SELECTORS ==========

// Get all columns
export const selectAllColumns = (state) => state.columns;

// ========== MEMOIZED SELECTORS ==========

// Get columns for a specific project (sorted by order)
export const selectColumnsByProject = createSelector(
    [selectAllColumns, (state, projectId) => projectId],
    (columns, projectId) => 
        columns
            .filter(col => col.projectId === projectId)
            .sort((a, b) => a.order - b.order)
);

// Get column by ID
export const selectColumnById = createSelector(
    [selectAllColumns, (state, columnId) => columnId],
    (columns, columnId) => columns.find(col => col.id === columnId)
);

// Get column count for a project
export const selectColumnCountByProject = createSelector(
    [selectColumnsByProject],
    (columns) => columns.length
);
