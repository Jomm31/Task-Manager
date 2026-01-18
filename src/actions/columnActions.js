const ADD_COLUMN = 'ADD_COLUMN';
const UPDATE_COLUMN = 'UPDATE_COLUMN';
const DELETE_COLUMN = 'DELETE_COLUMN';

function addColumn(projectId, columnName, order = 0){
    return {
        type: ADD_COLUMN,
        payload: {
            id: Date.now(),
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

export { addColumn, updateColumn, deleteColumn}