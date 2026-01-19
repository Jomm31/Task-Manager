const ADD_COLUMN = 'ADD_COLUMN';
const UPDATE_COLUMN = 'UPDATE_COLUMN';
const DELETE_COLUMN = 'DELETE_COLUMN';
const REORDER_COLUMNS = 'REORDER_COLUMNS';

function addColumn(projectId, columnName, order = 0, customId = null){
    return {
        type: ADD_COLUMN,
        payload: {
            id: customId || Date.now(),
            projectId,
            name: columnName,
            order
        }
    }
}

function updateColumn(columnId, updates){
    return {
        type: UPDATE_COLUMN,
        payload: {
            id: columnId,
            ...updates
        }
    }
}

function deleteColumn(columnId){
    return {
        type: DELETE_COLUMN,
        payload: columnId
    }
}

function reorderColumns(columnIds, projectId){
    return {
        type: REORDER_COLUMNS,
        payload: { columnIds, projectId }
    }
}

export { addColumn, updateColumn, deleteColumn, reorderColumns }